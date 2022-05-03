//import ytdl from 'ytdl-core';
import { AsyncDeviceDiscovery, Sonos } from 'sonos';
export async function getDevices(ctx) {
  try {
    const devices = await queryDevices();
    console.log(`getDevices (${Object.keys(devices).length})`);
    ctx.body = JSON.stringify(devices);
    ctx.response.set('content-type', 'application/json');
  } catch (err) {
    ctx.throw(500, err);
  }
}

async function queryDevices() {
  const discovery = new AsyncDeviceDiscovery();
  const devices = await discovery.discoverMultiple();
  const descriptions = await Promise.all(devices.map(device => device.deviceDescription()));

  return devices.reduce((all, device, index) => {
    const desc = descriptions[index] ?? {};

    const id = desc.serialNum; 
    const ipAddress = device.host;
    const model = `${desc.modelName}::${desc.modelNumber}`;
    const name = desc.roomName; 

    return {
      ...all,
      [id]: {
        id,
        ipAddress,
        model,
        name,
      },
    };
  }, {});
}

export async function postAction(ctx) {
  try {
    const data = ctx.request.body;
    let status = {};
    let error = null;

    if (data.ipAddress) {
      const device = new Sonos(data.ipAddress);
      let keys = {};

      try {
        for (const cmd of data.cmds) {
          const actionKeys = await action(cmd, device) ?? {};
          keys = { ...keys, ...actionKeys };
        }

        status = await getStatus(keys, device);
      } catch (err) {
        console.error('postAction error:', err);
        error = err;
      }

      const response = { ...status, error };
      ctx.body = JSON.stringify(response);
      ctx.response.set('content-type', 'application/json');
    }
  } catch (err) {
    ctx.throw(500, `postAction error: [${err}]`);
  }
}

function action(cmd, device) {
  switch (cmd.type) {
    case 'add':
      return add(cmd, device);
    case 'pause':
      return pause(cmd, device);
    case 'play':
      return play(cmd, device);
    case 'remove':
      return remove(cmd, device);
    case 'select':
      return select(cmd, device);
    case 'setVolume':
      return setVolume(cmd, device);
    default:
      return console.warn(`Unknown command [${cmd.type}]`);
  }
}

async function add(cmd, device) {
  const url = cmd.url;
  const index = cmd.index + 1;

  await device.queue(url, index);

  console.log(`add' '...${url.slice(-50)}' at ${index}`);
  return { sonosQueue: true };
}

async function pause(cmd, device) {
  await device.pause();

  console.log('pause');
  return { playing: true };
}

async function play(cmd, device) {
  await device.play();

  console.log('play');
  return { playing: true };
}

async function remove(cmd, device) {
  console.log(`REM (${cmd.index}) ${Number.isInteger(cmd.index)}`);
  if (cmd.all) {
    await device.flush();
    console.log('remove all');
  } else if (Number.isInteger(cmd.index)) {
    const index = cmd.index + 1;
    await device.removeTracksFromQueue(index, 1);
    console.log(' IDX', index);
  }

  return { sonosQueue: true };
}

async function select(cmd, device) {
  console.log(`SEL (${cmd.index}) ${Number.isInteger(cmd.index)}`);
  if (Number.isInteger(cmd.index)) {
    const index = cmd.index + 1;
    await device.selectTrack(index);

    const current = await device.currentTrack();
    console.log(`select '${current.title}' at ${current.queuePosition}`);

    return { index: true };
  }
}

async function setVolume(cmd, device) {
  await device.setVolume(cmd.volume);
  console.log(`setVolume (${cmd.volume})`);

  return { volume: true };
}

async function getStatus(toSend, device) {
  const keys = Object.keys(toSend);
  const values = await Promise.all(keys.map(async (key) => {
    if (key === 'volume') {
      const current = await device.currentTrack();
      console.log('CURR', current);
      return await device.getVolume();
    } else if (key === 'playing') {
      const state = await device.getCurrentState();
      return state !== 'paused' && state !== 'stopped';
    } else if (key === 'index') {
      const current = await device.currentTrack();
      return current.queuePosition - 1;
    } else if (key === 'sonosQueue') {
      const queue = await device.getQueue();
      const items = queue.items ?? [];
      return items.map(item => ({ url: item.uri }));
    }
  }));

  return keys.reduce((obj, key, index) => ({
    ...obj,
    [key]: values[index],
  }), {});
}

// ??? unused commands
//seek(seconds);
//getAllGroups();
//joinGroup(otherDeviceName)
//leaveGroup()
//next()
//previous()

/*
async function run() {
  const host = 'http://192.168.1.29:4445';
  //const address = '192.168.1.17';
  const ipAddress = '192.168.1.18';

  const path = '/Users/philmass/Music/Library/Sufjan Stevens/Illinois/13 Prairie Fire That Wanders About.mp3';
  const encodedPath = encodeURIComponent(path);
  const url0 = `${host}/songs/${encodedPath}`;

  const url1 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  const url2 = 'https://www.youtube.com/watch?v=u8pVZ5hTGJQ';

  const yt = ytdl(url2);
  //console.log('YT', yt);
  const info = await ytdl.getInfo(url2);
  //console.log('INFO', info);
  const format = ytdl.filterFormats(info.formats, 'audioonly');
  console.log('FM', format);

  //??? fix youtube

  const url = url0;
  await new Promise(r => setTimeout(r, 500));
  const device = new Sonos(ipAddress);
  console.log('PLAY\n', url, '\n', device);
  await queueSong(device, encodedPath);
}

run();
*/

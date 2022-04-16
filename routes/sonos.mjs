import ytdl from 'ytdl-core';
import { AsyncDeviceDiscovery, Sonos } from 'sonos';

//??? detect ip address of server
const host = 'http://192.168.1.29:4445';

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

export async function postAction(ctx) {
  try {
    const data = ctx.request.body;
    let result = null;
    let error = null;

    if (data.ipAddress) {
      const device = new Sonos(data.ipAddress);
      try {
        result = await action(data, device);
      } catch (err) {
        error = err;
      }

      const response = { ...result, error };
      ctx.body = JSON.stringify(response);
      ctx.response.set('content-type', 'application/json');
    }
  } catch (err) {
    ctx.throw(500, `postAction error: [${err}]`);
  }
}

function action(data, device) {
  switch (data.action) {
    case 'adjustVolume':
      return adjustVolume(device, data.inc);
    case 'clear':
      return clear(device);
    case 'queueSong':
      return queueSong(device, data.path);
    case 'setVolume':
      return setVolume(device, data.value);
    case 'togglePlay':
      return togglePlay(device);
  }
}

async function adjustVolume(device, inc) {
  await device.adjustVolume(inc);
  const volume = await device.getVolume();

  console.log(`adjustVolume (${volume})`);
  return { volume };
}

async function clear(device) {
  await device.flush();

  const queue = await device.getQueue();
  console.log(`clear [${queue.items.map(i => i.title)}]`);
  return { queue };
}

async function queueSong(device, path) {
  const url = `${host}/songs/${path}`;
  await device.play(url);

  const queue = await device.getQueue();
  console.log(`queueSong [${queue.items.map(i => i.title)}]`);
  return { queue };
}

async function setVolume(device, value) {
  await device.setVolume(value);
  const volume = await device.getVolume();

  console.log(`setVolume (${volume})`);
  return { volume };
}

async function togglePlay(device) {
  await device.togglePlayback();

  const current = await device.currentTrack();
  console.log(`togglePlay (${current.artist}::${current.album}::${current.title}`);
}

//??? actions
//queue(uri, positionInQueue);
//queueNext(uri);
//seek(seconds);
//leaveGroup()
//next()
//previous()
//joinGroup(otherDeviceName)
//selectTrack(index) [from index 1]

export async function getInfo(device) {
  const queue = await device.getQueue();
  const groups = await device.getAllGroups();
  const current = await device.currentTrack();
  const volume = await device.getVolume();

  console.log('\nINFO');
  console.log(' QUEUE ', queue.items.map(i => i.title));
  console.log(' GROUPS ', groups.map(g => g.Name));
  console.log(' CURRENT ', [current.artist, current.album, current.title]);
  console.log(' VOLUME ', volume);
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

  /*
  const url = url0;
  await new Promise(r => setTimeout(r, 500));
  const device = new Sonos(ipAddress);
  console.log('PLAY\n', url, '\n', device);
  await queueSong(device, encodedPath);
  */
}

//run();

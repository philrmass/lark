import { AsyncDeviceDiscovery, Sonos } from 'sonos';

export async function getDevices(ctx) {
  try {
    const devices = await queryDevices();
    ctx.body = JSON.stringify(devices);
    ctx.response.set('content-type', 'application/json');
  } catch (err) {
    ctx.throw(500, err);
  }
}

async function run() {
  const host = 'http://192.168.1.29:4445';
  const address = '192.168.1.17';

  const path = '/Users/philmass/Music/Library/Sufjan Stevens/Illinois/13 Prairie Fire That Wanders About.mp3';
  const encodedPath = encodeURIComponent(path);
  const url0 = `${host}/songs/${encodedPath}`;

  const url1 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  //??? fix youtube
  //const url2 = 'https://www.youtube.com/watch?v=u8pVZ5hTGJQ';

  const url = url0;
  await new Promise(r => setTimeout(r, 500));
  await playUrl(url, address);
}

run();

async function playUrl(url, address) {
  console.log(`Playing [${url}] at [${address}]`);
  const device = new Sonos(address);
  await device.play(url);

  const tr = await device.currentTrack();
  console.log(`Playing ${tr.artist}/${tr.album}/${tr.title}`);

  const time = 5000;
  await new Promise(r => setTimeout(r, time));
  await device.pause();
}

//??? update devices by id with more info
async function queryDevices() {
  const add = new AsyncDeviceDiscovery();
  const devices = await add.discoverMultiple();
  //console.log('devs', devices);
  const descriptions = await Promise.all(devices.map(device => device.deviceDescription()));

  //console.log('descs', descriptions);
  return devices.reduce((all, device, index) => {
    const name = descriptions[index]?.roomName; 

    return {
      ...all,
      [name]: device.host,
    };
  }, {});
}

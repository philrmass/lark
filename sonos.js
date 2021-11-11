const { AsyncDeviceDiscovery, Sonos } = require('sonos')

async function run() {
  //const devices = await getDevices();
  //const name = 'Kitchen'; //'Basement';
  //const addr = devices[name];
  //const addr = '192.168.1.16';
  const addr = '192.168.1.6';

  const device = new Sonos(addr);
  const time = 8000;
  console.log(`Running device at '${addr}`);

  await playSnippet(device, 'alabama', time);
  //await playSnippet(device, 'adele', time);
  //await playSnippet(device, 'bigThief', time);
  //await playSnippet(device, 'dylan', time);
  //await playSnippet(device, 'helix', time);
  await playSnippet(device, 'nirvana', time);
  //await playSnippet(device, 'radio', time);
}

run();

async function playSnippet(device, name, time) {
  await device.play(getUrl(name));

  const tr = await device.currentTrack();
  console.log(`Playing ${tr.artist}/${tr.album}/${tr.title}`);

  if (time) {
    await new Promise(r => setTimeout(r, time));
    await device.pause();
  }
}

function getUrl(name) {
  const warbler = 'http://192.168.1.29:4444/songs/';
  //const lark= 'http://192.168.1.29:4445/songs/';
  const server = warbler;
  const path = getPath(name);
  
  if (path) {
    return `${server}${path}`;
  }

  const path0 = '/Users/philmass/Music/Library/Adele/21/11 - Someone Like You.mp3';
  const path1 = '../../Desktop/Peter.mp3';
  const url6 = 'https://www.youtube.com/watch?v=u8pVZ5hTGJQ';

  switch (name) {
    case 'radio':
      return 'http://www.vpr.net/vpr_files/stream_playlists/vpr_bbc_mp3.pls';
    case 'helix':
      return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    default:
      return null;
  }
}

function getPath(name) {
  const nirvana = '/Users/philmass/Music/Library/Nirvana/In Utero/12 All Apologies.mp3';

  switch (name) {
    case 'adele':
      return '%2FUsers%2Fphilmass%2FMusic%2FLibrary%2FAdele%2F21%2F11%20-%20Someone%20Like%20You.mp3';
    case 'alabama':
  return '%2FUsers%2Fphilmass%2FMusic%2FLibrary%2FAlabama%20Shakes%2FSound%20%26%20Color%2F01%20Sound%20%26%20Color.mp3';
    case 'bigThief':
     return '%2FUsers%2Fphilmass%2FMusic%2FLibrary%2FBig%20Thief%2FCapacity%2F01%20Pretty%20Things.mp3';
    case 'dylan':
      return '%2FUsers%2Fphilmass%2FMusic%2FLibrary%2FBob%20Dylan%2FThe%20Bootleg%20Series%2C%20Volume%208_%20Tell%20Tale%20Signs_%20Rare%20and%20Unreleased%201989-2006%2F1-05%20Bob%20Dylan%20-%20Red%20River%20Shore.mp3';
    case 'nirvana':
      return encodeURIComponent(nirvana);
    default:
      return null;
  };
}

async function getDevices() {
  const add = new AsyncDeviceDiscovery();
  const devices = await add.discoverMultiple();
  const descriptions = await Promise.all(devices.map(device => device.deviceDescription()));

  return devices.reduce((all, device, index) => {
    const name = descriptions[index]?.roomName; 

    return {
      ...all,
      [name]: device.host,
    };
  }, {});
}

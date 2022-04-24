export async function exec(cmd, device) {
  const commands = {
    clear,
    adjustVolume,
    queueSong,
    setVolume,
    togglePlay,
  };

  const fail = (cmd) => console.error(`Unknown command [${cmd.type}]`);
  const action = commands[cmd.type] ?? fail;

  return await action(cmd, device);
}

async function adjustVolume(cmd, device) {
  const data = {
    action: 'adjustVolume',
    inc: cmd.inc,
    ipAddress: device.ipAddress,
  };

  return await post(data);
}

async function clear(cmd, device) {
  const data = {
    action: 'clear',
    ipAddress: device.ipAddress,
  };

  return await post(data);
}

async function queueSong(cmd, device) {
  const url = `${process.env.API_HOST}/songs/${encodeURIComponent(cmd.song.path)}`;
  const data = {
    action: 'queueSong',
    url,
    index: cmd.index,
    play: cmd.play,
    ipAddress: device.ipAddress,
  };

  const result = await post(data);
  const items = result.queue ?? [];
  const queue = items.map(item => ({ path: getPath(item.url) }));
  return { song: cmd.song, queue };
}

function getPath(url) {
  const base = `${process.env.API_HOST}/songs/`;
  const length = base.length;

  if (url.startsWith(base)) {
    return decodeURIComponent(url.slice(length));
  }

  return null;
}

async function setVolume(cmd, device) {
  const data = {
    action: 'setVolume',
    value: cmd.value,
    ipAddress: device.ipAddress,
  };

  return await post(data);
}

async function togglePlay(cmd, device) {
  const data = {
    action: 'togglePlay',
    ipAddress: device.ipAddress,
  };

  return await post(data);
}

async function post(data) {
  const url = `${process.env.API_HOST}/sonos/`;
  const params = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url, params);
  return await response.json();
}

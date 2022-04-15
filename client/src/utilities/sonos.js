const isDev = true;
const API_HOST = isDev ? 'http://0.0.0.0:4445' : '';

export async function exec(cmd, device) {
  const commands = {
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

  await post(data);
}

async function queueSong(cmd, device) {
  const data = {
    action: 'queueSong',
    index: 0,
    path: encodeURIComponent(cmd.song.path),
    ipAddress: device.ipAddress,
  };
  await post(data);

  return { song: { ...cmd.song } };
}

async function setVolume(cmd, device) {
  const data = {
    action: 'setVolume',
    value: cmd.value,
    ipAddress: device.ipAddress,
  };

  await post(data);
}

async function togglePlay(cmd, device) {
  const data = {
    action: 'togglePlay',
    ipAddress: device.ipAddress,
  };
  await post(data);
}

async function post(data) {
  const url = `${API_HOST}/sonos/`;
  const params = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  await fetch(url, params);
}

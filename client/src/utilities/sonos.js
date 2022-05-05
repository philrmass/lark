export async function exec(cmds, device) {
  const all = cmds.map(cmd => convertCommand(cmd));
  const filtered = all.filter(cmd => Boolean(cmd));

  const data = {
    ipAddress: device.ipAddress,
    cmds: filtered,
  };

  const result = await post(data);
  //??? remove console.log(`SONOS (${device?.name})`, data.cmds.map(cmd => cmd.type));

  if (result.sonosQueue) {
    result.sonosQueue = convertQueue(result.sonosQueue);
  }

  return result;
}

function convertCommand(cmd) {
  switch (cmd.type) {
    case 'add':
      return convertAdd(cmd);
    case 'getTime':
    case 'pause':
    case 'play':
    case 'remove':
    case 'select':
    case 'setVolume':
      return cmd;
    default:
      console.warn(`Unknown command [${cmd.type}]`);
      return null;
  }
}

function convertAdd(cmd) {
  const url = `${process.env.API_HOST}/songs/${encodeURIComponent(cmd.song.path)}`;

  return {
    type: cmd.type,
    index: cmd.index,
    url,
  };
}

function convertQueue(queue) {
  if (queue) {
    return queue.map(item => ({ path: getPath(item.url) }));
  }
}

function getPath(url) {
  const base = `${process.env.API_HOST}/songs/`;
  const length = base.length;

  if (url.startsWith(base)) {
    return decodeURIComponent(url.slice(length));
  }

  return null;
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

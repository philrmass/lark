export async function exec(cmds, device) {
  const all = cmds.map(cmd => convertCommand(cmd));
  const filtered = all.filter(cmd => Boolean(cmd));

  const data = {
    ipAddress: device.ipAddress,
    cmds: filtered,
  };

  const result = await post(data);
  await console.log('EXEC-SONOS\ndata', data, '\nresult', result);

  return {
    ...result,
    sonosQueue: convertQueue(result.queue),
  };
}

function convertCommand(cmd) {
  switch (cmd.type) {
    case 'add':
      return convertAdd(cmd);
    case 'play':
    case 'select':
      return cmd;
    default:
      console.error(`Unknown command [${cmd.type}]`);
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

/*
async function adjustVolume(cmd, device) {
  const data = {
    action: 'adjustVolume',
    inc: cmd.inc,
  };

  return await post(data);
}

async function clear(cmd, device) {
  const data = {
    action: 'clear',
  };

  return await post(data);
}

async function setVolume(cmd, device) {
  const data = {
    action: 'setVolume',
    value: cmd.value,
  };

  return await post(data);
}

async function togglePlay(cmd, device) {
  const data = {
    action: 'togglePlay',
  };

  return await post(data);
}
*/

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

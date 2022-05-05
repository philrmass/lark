// ??? functions to add
// - getStatus [on device choose]
// - remove (index)

export function translateAction(action, state) {
  switch (action.type) {
    case 'adjustVolume':
      return adjustVolume(action, state);
    case 'clearQueue':
      return clearQueue(action, state);
    case 'getTime':
      return getTime(action, state);
    case 'queueSong':
      return queueSong(action, state);
    case 'setVolume':
      return setVolume(action, state);
    case 'syncQueue':
      return syncQueue(action, state);
    case 'togglePlay':
      return togglePlay(action, state);
    default:
      console.warn(`Unknown action '${action.type}'`);
      return [];
  }
}

function adjustVolume(action, state) {
  const volume = state.volume + action.inc;

  return [{ type: 'setVolume', volume }];
}

function clearQueue() {
  return [{ type: 'remove', all: true }];
}

function getTime() {
  return [{ type: 'getTime' }];
}

function queueSong(action, state) {
  let index = state.queue.length;

  if (action.index === 0) {
    index = state.index;
  } else if (action.index === 1) {
    index = state.index + 1;
  }

  const cmds = [{ type: 'add', song: action.song, index }];

  if (action.play && !state.playing) {
    cmds.push({ type: 'select', index });
    cmds.push({ type: 'play' });
  }

  return cmds;
}

function setVolume(action) {
  return [{ type: 'setVolume', volume: action.volume }];
}

function syncQueue(_action, state) {
  const remove = { type: 'remove', all: true };
  const adds = state.queue.map((song, index) => ({ type: 'add', song, index }));
  const cmds = [remove, ...adds];

  if (state.index >= 0 && state.index < state.queue.length) {
    cmds.push({ type: 'select', index: state.index });
  }

  return cmds;
}

function togglePlay(action, state) {
  if (state.playing) {
    return [{ type: 'pause' }];
  }

  return [{ type: 'play' }];
}

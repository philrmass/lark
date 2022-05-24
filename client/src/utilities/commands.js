export function translateAction(action, state) {
  switch (action.type) {
    case 'adjustTime':
      return adjustTime(action, state);
    case 'adjustVolume':
      return adjustVolume(action, state);
    case 'clearQueue':
      return clearQueue(action, state);
    case 'getTime':
      return getTime(action, state);
    case 'next':
      return next(action, state);
    case 'previous':
      return previous(action, state);
    case 'queueSong':
      return queueSong(action, state);
    case 'queueSongs':
      return queueSongs(action, state);
    case 'setTime':
      return setTime(action, state);
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

function adjustTime(action, state) {
  const time = state.time + action.inc;

  return [{ type: 'setTime', time }];
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

function next(_action, state) {
  const index = state.index + 1;

  if (index < state.queue.length) {
    return [{ type: 'select', index }];
  }

  return [];
}

function previous(_action, state) {
  const index = state.index - 1;

  if (state.time > 0) {
    return [{ type: 'setTime', time: 0 }];
  } else if (index >= 0) {
    return [{ type: 'select', index }];
  }

  return [];
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
    cmds.push({ type: 'setVolume', volume: state.volume });
    cmds.push({ type: 'play' });
  }

  return cmds;
}

function queueSongs(action, state) {
  let baseIndex = state.queue.length;

  if (action.index === 0) {
    baseIndex = state.index;
  } else if (action.index === 1) {
    baseIndex = state.index + 1;
  }

  const cmds = action.songs.map((song, index) => ({
    type: 'add',
    song,
    index: baseIndex + index,
  }));

  if (action.play && !state.playing) {
    cmds.push({ type: 'select', index: baseIndex });
    cmds.push({ type: 'setVolume', volume: state.volume });
    cmds.push({ type: 'play' });
  }

  return cmds;
}

function setTime(action) {
  return [{ type: 'setTime', time: action.time }];
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

  return [{ type: 'setVolume', volume: state.volume }, { type: 'play' }];
}

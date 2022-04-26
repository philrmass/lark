// Basic functions
// - add (song, index)
// - getVolume
// - play
// - pause
// - remove (index, all)
// - select (index)
// - setVolume (level)

export function translateAction(action, state) {
  switch (action.type) {
    case 'clearQueue':
      return clearQueue(action, state);
    case 'queueSong':
      return queueSong(action, state);
    case 'syncQueue':
      return syncQueue(action, state);
    case 'togglePlay':
      return togglePlay(action, state);
    default:
      console.warn('UNKNOWN ACTION', action.type);
      return [];
  }
}

function clearQueue() {
  return [{ type: 'remove', all: true }];
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

function syncQueue(_action, state) {
  const remove = { type: 'remove', all: true };
  const adds = state.queue.map(song => ({ type: 'add', song, index: -1 }));
  //const select = { type: 'select', index: state.index };
  const cmds = [remove, ...adds];//, select];

  /*
  if (state.playing) {
    cmds.push({ type: 'play' });
  }
  */

  return cmds;
}

function togglePlay(action, state) {
  if (state.playing) {
    return [{ type: 'pause' }];
  }

  return [{ type: 'play' }];
}

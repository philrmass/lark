// Basic functions
// - add (song, index)
// - remove (index)
// - removeAll
// - setVolume (level)
// - getVolume
// - play (index = current)
// - pause

export function translateAction(action, state) {
  switch (action.type) {
    case 'clearQueue':
      return clearQueue(action, state);
    case 'queueSong':
      return queueSong(action, state);
    default:
      return [];
  }
}

function clearQueue(action, state) {
  const indices = [...Array(state.queue.length).keys()].reverse();
  const filtered = indices.filter(index => !state.playing || index !== state.index);
  return filtered.map(index => ({ type: 'remove', index }));
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

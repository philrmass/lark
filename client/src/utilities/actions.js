export function adjustVolume(inc) {
  return {
    type: 'adjustVolume',
    inc,
  };
}

export function clearQueue() {
  return {
    type: 'clearQueue',
  };
}

export function queueSong(song, index = -1, play) {
  return {
    type: 'queueSong',
    song: { ...song },
    index,
    play,
  };
}

export function setVolume(value) {
  return {
    type: 'setVolume',
    value,
  };
}

export function syncQueue() {
  console.log('syncQueue');
  return {};
  /*
  return {
    type: 'syncQueue',
  };
  */
}

export function togglePlay() {
  return {
    type: 'togglePlay',
  };
}

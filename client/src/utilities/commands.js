export function adjustVolume(inc) {
  return {
    type: 'adjustVolume',
    inc,
  };
}

export function clear() {
  return {
    type: 'clear',
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

export function togglePlay() {
  return {
    type: 'togglePlay',
  };
}

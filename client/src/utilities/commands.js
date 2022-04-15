export function adjustVolume(inc) {
  return {
    type: 'adjustVolume',
    inc,
  };
}

export function queueSong(song) {
  return {
    type: 'queueSong',
    song: { ...song },
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

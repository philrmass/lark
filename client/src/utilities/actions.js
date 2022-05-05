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

export function getTime() {
  return {
    type: 'getTime',
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

export function setVolume(volume) {
  return {
    type: 'setVolume',
    volume,
  };
}

export function syncQueue() {
  return {
    type: 'syncQueue',
  };
}

export function togglePlay() {
  return {
    type: 'togglePlay',
  };
}

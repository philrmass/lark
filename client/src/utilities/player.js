export async function exec(cmds, player) {
  const commands = {
    adjustVolume,
    queueSong,
    setVolume,
    togglePlay,
  };
  await console.log('EXEC-PLAYER', cmds, typeof player, typeof commands);

  /*
  const fail = (cmd) => console.error(`Unknown command [${cmd.type}]`);
  const action = commands[cmd.type] ?? fail;

  return await action(cmd, player);
  */
}

function adjustVolume(cmd, player) {
  const scale = 100;
  const incScale = 1 + 4 * player.volume;
  const inc = incScale * cmd.inc;
  const value = (scale * player.volume + inc);

  setVolume({ value }, player);
}

async function queueSong(cmd, player) {
  try {
    const encodedPath = encodeURIComponent(cmd.song.path);
    const response = await fetch(`${process.env.API_HOST}/songs/${encodedPath}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    player.src = url;
    //??? use index and play in queueSong
    player.play();
    
    return { song: { ...cmd.song, url } };
  } catch (err) {
    console.error(`Error fetching song (${cmd.path}):`, err);
  }
}

function setVolume(cmd, player) {
  const scale = 100;
  const scaled = cmd.value / scale;
  const clipped = Math.min(Math.max(scaled, 0), 1);

  player.volume = clipped;
}

function togglePlay(_cmd, player) {
  if (player.src) {
    player.paused ? player.play() : player.pause();
  }
}

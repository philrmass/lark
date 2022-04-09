import { useRef } from 'react';
import { Link } from 'preact-router/match';
import styles from './Song.module.css';

export default function Song({ entry }) {
  const data = [
    ['Artist', entry.artist],
    ['Album', entry.album],
    ['Album Index', entry.songIndex],
    ['Duration', toTime(entry.duration)],
    ['Size (MB)', toMb(entry.size)],
    ['Bitrate (kbps)', toKbps(entry.bitrate)],
    ['Path', entry.path],
  ];
  const player = useRef(null);

  function buildDetails(data) {
    return (
      <div className={styles.detailsSection}>
        <div className={styles.details}>
          {data.map(entry => (
            <>
              <div>{`${entry[0]}:`}</div>
              <div>{entry[1]}</div>
            </>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.song}>
      <Link href="/">Back to home</Link>
      <h1>{entry.title}</h1>
      <div>
        <audio ref={player} controls />
      </div>
      <div className={styles.buttons}>
        <button onClick={() => playSong(player, entry.path)}>Play</button>
      </div>
      {buildDetails(data)}
    </div>
  );
}

function toTime(totalSec) {
  const secPerMin = 60;
  const min = Math.floor(totalSec / secPerMin);
  const sec = totalSec - (min * secPerMin);
  const secStr = sec.toFixed(0).padStart(2, '0');
  return `${min}:${secStr}`;
}

function toMb(bytes) {
  const bytesPerMb = 1024 * 1024;
  return (bytes / bytesPerMb).toFixed(3)
}

function toKbps(bps) {
  const bytesPerKb = 1024;
  return Math.round(bps / bytesPerKb);
}

async function playSong(player, path) {
  console.log(`PLAY (${path})`);

  try {
    const response = await fetch(`http://localhost:4445/songs/${encodeURIComponent(path)}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    player.current.src = url;
    player.current.play();
  } catch (err) {
    console.error('Could not fetch song:', err);
  }
}

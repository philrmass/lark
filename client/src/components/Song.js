import { Fragment } from 'react';
import { Link } from 'preact-router/match';
import { toTime, toMb, toKbps } from '../utilities/display';
import styles from './Song.module.css';

function addSong(song) {
  //??? add queue options
  return {
    type: 'addSong',
    song: { ...song },
  };
}

export default function Song({ entry, exec }) {
  const data = [
    ['Artist', entry.artist],
    ['Album', entry.album],
    ['Album Index', entry.songIndex],
    ['Duration', toTime(entry.duration)],
    ['Size (MB)', toMb(entry.size)],
    ['Bitrate (kbps)', toKbps(entry.bitrate)],
  ];

  function buildDetails(data) {
    return (
      <div className={styles.detailsSection}>
        <div className={styles.details}>
          {data.map(entry => (
            <Fragment key={entry[0]}>
              <div>{`${entry[0]}:`}</div>
              <div>{entry[1]}</div>
            </Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.song}>
      <Link href="/">Back to home</Link>
      <h1>{entry.title}</h1>
      <div className={styles.buttons}>
        <button onClick={() => exec(addSong(entry))}>Play</button>
      </div>
      {buildDetails(data)}
    </div>
  );
}

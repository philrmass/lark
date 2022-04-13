import { Fragment } from 'react';
import { Link, route } from 'preact-router/match';

import { toTime, toMb, toKbps } from '../utilities/display';
import styles from './Song.module.css';

function addSong(song) {
  //??? add queue options
  return {
    type: 'addSong',
    song: { ...song },
  };
}

export default function Song({ guid, entries, exec }) {
  const song = entries[guid];

  if (!song) {
    return <div>Loading...</div>;
  }

  if (song?.type !== 'song') {
    route('/', true);
  }

  const data = [
    ['Artist', song.artist],
    ['Album', song.album],
    ['Album Index', song.songIndex],
    ['Duration', toTime(song.duration)],
    ['Size (MB)', toMb(song.size)],
    ['Bitrate (kbps)', toKbps(song.bitrate)],
  ];

  function buildDetails(data) {
    return (
      <div className={styles.detailsSection}>
        <div className={styles.details}>
          {data.map(song => (
            <Fragment key={song[0]}>
              <div>{`${song[0]}:`}</div>
              <div>{song[1]}</div>
            </Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.song}>
      <Link href="/">Back to home</Link>
      <h1>{song.title}</h1>
      <div className={styles.buttons}>
        <button onClick={() => exec(addSong(song))}>Play</button>
      </div>
      {buildDetails(data)}
    </div>
  );
}

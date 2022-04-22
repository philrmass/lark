import { Fragment, useState } from 'react';
import { route } from 'preact-router';

import { queueSong } from '../utilities/commands';
import { toTime, toMb, toKbps } from '../utilities/display';
import styles from './Song.module.css';
import Breadcrumbs from './Breadcrumbs';

export default function Song({ guid, entries, exec }) {
  const song = entries[guid];
  const [play, setPlay] = useState(true);

  if (!song) {
    return <div>Loading...</div>;
  }

  if (song?.type !== 'song') {
    route('/', true);
  }

  const data = [
    ['Title', song.title],
    ['Artist', song.artist],
    ['Album', song.album],
    ['Album Index', song.songIndex],
    ['Duration', toTime(song.duration)],
    ['Size (MB)', toMb(song.size)],
    ['Bitrate (kbps)', toKbps(song.bitrate)],
  ];

  function queueAt(index) {
    exec(queueSong(song, index, play));
    //??? reset checkbox to current playing state
    setPlay(true);
  }

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
    <div className={styles.main}>
      <Breadcrumbs entry={song} />
      <div className={styles.buttons}>
        <button className='button' onClick={() => queueAt(0)}>Now</button>
        <button className='button' onClick={() => queueAt(1)}>Next</button>
        <button className='button' onClick={() => queueAt(-1)}>Append</button>
        <label>
          <input type='checkbox' checked={play} />
          <span className={styles.label}>Play</span>
        </label>
      </div>
      {buildDetails(data)}
    </div>
  );
}

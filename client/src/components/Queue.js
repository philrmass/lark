import { useEffect } from 'react';

import { toTime } from '../utilities/display';
import styles from './Queue.module.css';

export default function Queue ({
  queue,
  index,
  playing,
  setContent,
  toggleQueue,
}) {
  useEffect(() => {
    setContent(null);
  }, [setContent]);

  function buildSong(song, iSong) {
    const isCurrent = iSong === index;
    
    return (
      <div key={`${iSong}-${song.guid}`} className={styles.song}>
        <span className={styles.status}>
          {isCurrent ? (playing ? '~' : '-') : ''}
        </span>
        {song.title}
        <span className={styles.duration}>
          {toTime(song.duration)}
        </span>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.songs}>
        {queue.map((song, index) => buildSong(song, index))}
      </div>
      <div className={styles.buttons}>
        <button className='button' onClick={toggleQueue}>Back</button>
      </div>
    </div>
  );
}

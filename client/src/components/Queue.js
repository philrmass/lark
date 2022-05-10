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
      <>
        <span className={styles.status}>
          {isCurrent ? (playing ? '~' : '-') : ''}
        </span>
        <span className={styles.duration}>
          {toTime(song.duration)}
        </span>
        <span className={styles.title}>
          {song.title}
        </span>
      </>
    );
  }

  return (
    <div className={styles.main} onClick={toggleQueue}>
      {queue.map((song, index) => buildSong(song, index))}
    </div>
  );
}

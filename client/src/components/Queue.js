import { useEffect } from 'react';

import { toTime } from '../utilities/display';
import styles from './Queue.module.css';

export default function Queue ({ queue, setContent }) {
  useEffect(() => {
    setContent(null);
  }, [setContent]);

  function buildSong(song, index) {
    return (
      <div key={`${index}-${song.guid}`}>
        {`${toTime(song.duration)} ${song.title}`}
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <button onClick={() => history.back()}>{'<- Back'}</button>
      <div>
        {queue.map((song, index) => buildSong(song, index))}
      </div>
    </div>
  );
}

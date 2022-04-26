import { Link } from 'preact-router/match';

import { toTime } from '../utilities/display';
import { clearQueue } from '../utilities/actions';
import styles from './QueueStatus.module.css';

export default function QueueStatus({ queue, index, exec }) {
  function buildDuration() {
    const total = queue.reduce((total, song) => total + song.duration, 0);
    return `${toTime(total)}`;
  }

  function buildNext() {
    if (index + 1 < queue.length) {
      return `Next: ${queue[index + 1].title}`;
    }
  }

  return (
    <div className={styles.main}>
      <Link href={'/queue'}>
        <div className={styles.status}>
          <div>{`${queue.length} songs`}</div>
          <div>{buildDuration()}</div>
          <div className={styles.next}>{buildNext()}</div>
        </div>
      </Link>
      <button className='button' onClick={() => exec(clearQueue())}>
        Clear
      </button>
    </div>
  );
}

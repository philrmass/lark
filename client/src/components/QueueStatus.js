import { toTime } from '../utilities/display';
import { clearQueue } from '../utilities/actions';
import styles from './QueueStatus.module.css';

export default function QueueStatus({
  queue,
  index,
  exec,
  toggleQueue,
}) {
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
      <div className={styles.status} onClick={toggleQueue}>
        <div>{`${queue.length} songs`}</div>
        <div>{buildDuration()}</div>
        <div className={styles.next}>{buildNext()}</div>
      </div>
      <div className={styles.buttons}>
        <button className='button' onClick={() => exec(clearQueue())}>
          Clear
        </button>
      </div>
    </div>
  );
}

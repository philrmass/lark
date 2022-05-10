import { toTime } from '../utilities/display';
import { clearQueue } from '../utilities/actions';
import styles from './QueueStatus.module.css';
import Output from './Output';

export default function QueueStatus({
  devices,
  output,
  queue,
  index,
  exec,
  changeOutput,
  toggleQueue,
}) {
  function buildDuration() {
    const total = queue.reduce((total, song) => total + song.duration, 0);
    return `${toTime(total)}`;
  }

  return (
    <div className={styles.main}>
      <div className={styles.output}>
        <Output devices={devices} output={output} changeOutput={changeOutput} />
      </div>
      <div className={styles.status} onClick={toggleQueue}>
        <div className={styles.next}>
          {`Next: ${queue[index + 1]?.title ?? ''}`}
        </div>
        <div className={styles.numbers}>
          <div>{`${queue.length} songs`}</div>
          <div>{buildDuration()}</div>
        </div>
      </div>
      <div className={styles.clear}>
        <button className='btn' onClick={() => exec(clearQueue())}>
          Clear
        </button>
      </div>
    </div>
  );
}

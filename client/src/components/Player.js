import { adjustVolume, togglePlay } from '../utilities/actions';
import { toTime } from '../utilities/display';
import styles from './Player.module.css';

export default function Player({
  queue,
  index,
  playing,
  volume,
  time,
  exec,
}) {
  const song = queue?.at(index);
  const volumeStyle = { width: `${volume}%` };
  const duration = song?.duration ?? 1;
  const timePercent = 100 * (time / duration);
  const timeStyle = { width: `${timePercent}%` };
  const timeStr = toTime(time);
  const remainingStr = toTime(duration - time);

  return (
    <div className={styles.main}>
      <div className={styles.row}>
        <button className='btn-sm' onClick={() => exec(adjustVolume(-1))}>
          -
        </button>
        <div className={styles.barWrap}>
          <div className={styles.bar} style={volumeStyle} />
        </div>
        <button className='btn-sm' onClick={() => exec(adjustVolume(+1))}>
          +
        </button>
      </div>
      <div className={styles.controls}>
        <div>
          <button className='btn'>
            {'|<'}
          </button>
          <button className='btn' onClick={() => exec(togglePlay())}>
            {playing ? '||' : '>'}
          </button>
        </div>
      <div className={styles.title}>{song?.title ?? ''}</div>
        <button className='btn'>
          {'>|'}
        </button>
      </div>
      <div className={styles.row}>
        <button className='btn-sm'>
          -
        </button>
        <div className={styles.barWrap}>
          <div className={styles.bar} style={timeStyle} />
        </div>
        <button className='btn-sm'>
          +
        </button>
      </div>
      <div className={styles.times}>
        <span>{timeStr}</span>
        <span>{remainingStr}</span>
      </div>
      <div />
    </div>
  );
}

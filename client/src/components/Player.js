import { adjustVolume, togglePlay } from '../utilities/actions';
import styles from './Player.module.css';

export default function Player({ song, playing, volume, exec }) {
  return (
    <div className={styles.main}>
      <div className={styles.volume}>
        <button className='btn-sm' onClick={() => exec(adjustVolume(-1))}>-</button>
        <div>{volume}</div>
        <button className='btn-sm' onClick={() => exec(adjustVolume(+1))}>+</button>
      </div>
      <div className={styles.controls}>
        <div>
          <button className='button'>{'|<'}</button>
          <button className='button' onClick={() => exec(togglePlay())}>{playing ? '||' : '>'}</button>
        </div>
        <div className={styles.title}>{song?.title ?? ''}</div>
        <button className='button'>>|</button>
      </div>
      <div className={styles.time}>
        <button className='btn-sm'>-</button>
        <div>{'1:24 | 3:45'}</div>
        <button className='btn-sm'>+</button>
      </div>
    </div>
  );
}

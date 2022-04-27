import classnames from 'classnames';
import { adjustVolume, togglePlay } from '../utilities/actions';
import styles from './Player.module.css';

export default function Player({ song, playing, exec }) {
  const playClasses = classnames('button', styles.play);
  const adjustClasses = classnames('button', styles.adjust);

  return (
    <div className={styles.main}>
      <button className={playClasses} onClick={() => exec(togglePlay())}>{playing ? '||' : '>'}</button>
      <div className={styles.volume}>
        <button className={adjustClasses} onClick={() => exec(adjustVolume(+1))}>+</button>
        <button className={adjustClasses} onClick={() => exec(adjustVolume(-1))}>-</button>
      </div>
      <div className={styles.title}>
        {song?.title ?? ''}
      </div>
    </div>
  );
}

import { adjustVolume, togglePlay } from '../utilities/commands';
import styles from './Player.module.css';

export default function Player({ song, exec }) {
  return (
    <div className={styles.player}>
      <button className={styles.play} onClick={() => exec(togglePlay())}>P</button>
      <div className={styles.volume}>
        <button className={styles.adjust} onClick={() => exec(adjustVolume(+1))}>+</button>
        <button className={styles.adjust} onClick={() => exec(adjustVolume(-1))}>-</button>
      </div>
      <div>{song?.title ?? ''}</div>
    </div>
  );
}

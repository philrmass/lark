import { useEffect, useRef } from 'react';
import styles from './Player.module.css';

export default function Player({ songUrl }) {
  const player = useRef(null);

  useEffect(() => {
    if (songUrl !== player.current.src) {
      player.current.src = songUrl;
      player.current.play();
    }
  }, [songUrl]);

  return (
    <div className={styles.player}>
      <audio ref={player} controls />
    </div>
  );
}

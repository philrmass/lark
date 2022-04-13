import { useEffect, useRef } from 'react';
import styles from './Player.module.css';

function togglePlay() {
  return {
    type: 'togglePlay',
  };
}

export default function Player({ exec }) {
  return (
    <div className={styles.player}>
      <button onClick={() => exec(togglePlay())}>P</button>
    </div>
  );
}

import { Link } from 'preact-router/match';
import styles from './Album.module.css';

export default function Album({ entry, entries }) {
  return (
    <div>
      <Link href="/">Back to home</Link>
      <div>ALBUM</div>
      <div>ENTRY:</div>
      <div className={styles.json}>{JSON.stringify(entry, null, 2)}</div>
      <div>ENTRIES:</div>
      <div className={styles.json}>{JSON.stringify(entries, null, 2)}</div>
    </div>
  );
}

import styles from './Song.module.css';

export default function Song({ entry }) {
  return (
    <div>
      <Link href="/">Back to home</Link>
      <div>SONG</div>
      <div>ENTRY:</div>
      <div className={styles.json}>{JSON.stringify(entry, null, 2)}</div>
    </div>
  );
}

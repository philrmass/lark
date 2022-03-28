import { Link } from 'preact-router/match';
import Artist from './Artist';
import NotFound from './NotFound';
import styles from './Entry.module.css';

export default function Entry({ guid, entries }) {
  const entry = entries[guid];

  if (entry?.type === 'artist') {
    return <Artist entry={entry} entries={entries} />
  } else {
    return (
      <div>
        <Link href="/">Back to home</Link>
        <div>ENTRY:</div>
        <div className={styles.json}>{JSON.stringify(entry, null, 2)}</div>
      </div>
    );
  }
}

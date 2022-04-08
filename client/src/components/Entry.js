import { Link } from 'preact-router/match';
import Album from './Album';
import Artist from './Artist';
import Song from './Song';
import NotFound from './NotFound';
import styles from './Entry.module.css';

export default function Entry({ guid, entries }) {
  const entry = entries[guid];

  if (entry?.type === 'artist') {
    return <Artist entry={entry} entries={entries} />
  } else if (entry?.type === 'album') {
    return <Album entry={entry} entries={entries} />
  } else if (entry?.type === 'song') {
    return <Song entry={entry} />
  } else {
    return (
      <div>
        <Link href="/">Back to home</Link>
        <div>UNKNOWN ENTRY:</div>
        <div className={styles.json}>{JSON.stringify(entry, null, 2)}</div>
      </div>
    );
  }
}

import { Link } from 'preact-router/match';
import styles from './Album.module.css';

export default function Album({ entry, entries }) {
  function buildSong(guid) {
    const song = entries[guid];

    return (
      <Link href={`/entries/${guid}`}>
        <div className={styles.song}>
          {`${song.title} (${guid.slice(0, 4)})`}
        </div>
      </Link>
    );
  }

  return (
    <div>
      <Link href="/" className='back'>{`< Home`}</Link>
      <h1>{entry.title}</h1>
      {entry.songGuids.map(guid => buildSong(guid))}
      <div className={styles.json}>{JSON.stringify(entry, null, 2)}</div>
    </div>
  );
}

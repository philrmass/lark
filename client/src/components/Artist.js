import { Link } from 'preact-router/match';
import styles from './Artist.module.css';

export default function Artist({ entry, entries }) {
  function buildAlbum(guid) {
    const album = entries[guid];

    return (
      <Link href={`/entries/${guid}`}>
        <div className={styles.album}>
          {`${album.title} (${guid.slice(0, 4)})`}
        </div>
      </Link>
    );
  }

  return (
    <div>
      <Link href='/' className='back'>{'< Home'}</Link>
      <h1>{entry.name}</h1>
      {entry.albumGuids.map(guid => buildAlbum(guid))}
      <div>ENTRY:</div>
      <div className={styles.json}>{JSON.stringify(entry, null, 2)}</div>
      <div>ENTRIES:</div>
      <div className={styles.json}>{JSON.stringify(entries, null, 2)}</div>
    </div>
  );
}

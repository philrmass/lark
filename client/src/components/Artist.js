import { Link } from 'preact-router/match';
import styles from './Artist.module.css';

export default function Artist({ entry, entries }) {
  function buildAlbum(guid) {
    const album = entries[guid];

    return (
      <div className={styles.album}>
        {guid}
        <div className={styles.json}>${JSON.stringify(album, null, 2)}$</div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/" className='back'>{`< Back`}</Link>
      <h1>{entry.name}</h1>
      {entry.albums.map(album => buildAlbum(album))}
      <div>ENTRY:</div>
      <div className={styles.json}>{JSON.stringify(entry, null, 2)}</div>
      <div>ENTRIES:</div>
      <div className={styles.json}>{JSON.stringify(entries, null, 2)}</div>
    </div>
  );
}

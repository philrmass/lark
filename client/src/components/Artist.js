import { route } from 'preact-router';
import { Link } from 'preact-router/match';
import styles from './Artist.module.css';

export default function Artist({ guid, entries }) {
  const artist = entries[guid];

  if (!artist) {
    return <div>Loading...</div>;
  }

  if (artist?.type !== 'artist') {
    route('/', true);
  }

  function buildAlbum(guid) {
    const album = entries[guid];

    return (
      <Link href={`/albums/${guid}`}>
        <div className={styles.album}>
          {`${album.title} (${guid.slice(0, 4)})`}
        </div>
      </Link>
    );
  }

  return (
    <div>
      <Link href='/' className='back'>{'< Home'}</Link>
      <h1>{artist.name}</h1>
      {artist.albumGuids.map(guid => buildAlbum(guid))}
    </div>
  );
}

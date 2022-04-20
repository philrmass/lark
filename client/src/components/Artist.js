import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import styles from './Artist.module.css';
import Breadcrumbs from './Breadcrumbs';

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
          {album.title}
        </div>
      </Link>
    );
  }

  return (
    <div className={styles.main}>
      <Breadcrumbs entry={artist} />
      {artist.albumGuids.map(guid => buildAlbum(guid))}
    </div>
  );
}

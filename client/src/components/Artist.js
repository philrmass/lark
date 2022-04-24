import { useEffect } from 'react';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import styles from './Artist.module.css';

export default function Artist({ guid, entries, setContent }) {
  const artist = entries[guid];

  useEffect(() => {
    if (artist) {
      setContent(artist);
    }
  }, [artist, setContent]);

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
      {artist.albumGuids.map(guid => buildAlbum(guid))}
    </div>
  );
}

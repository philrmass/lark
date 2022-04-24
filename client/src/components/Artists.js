import { useEffect } from 'react';
import { Link } from 'preact-router/match';

import styles from './Artists.module.css';

export default function Artists({ artists, setContent }) {
  useEffect(() => {
    setContent({ type: 'artists' });
  }, [setContent]);

  function buildArtist(artist) {
    return (
      <Link href={`/artists/${artist.guid}`}>
        <div className={styles.artist}>
          {artist.name}
        </div>
      </Link>
    );
  }

  return (
    <div className={styles.main}>
      {artists.map(artist => buildArtist(artist))}
    </div>
  );
}

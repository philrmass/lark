import { Link } from 'preact-router/match';

import styles from './Artists.module.css';
import Breadcrumbs from './Breadcrumbs';

export default function Artists({ artists }) {
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
      <Breadcrumbs />
      {artists.map(artist => buildArtist(artist))}
    </div>
  );
}

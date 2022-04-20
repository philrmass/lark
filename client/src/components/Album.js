import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import styles from './Album.module.css';
import Breadcrumbs from './Breadcrumbs';

export default function Album({ guid, entries }) {
  const album = entries[guid];

  if (!album) {
    return <div>Loading...</div>;
  }

  if (album?.type !== 'album') {
    route('/', true);
  }

  function buildSong(guid) {
    const song = entries[guid];

    return (
      <Link href={`/songs/${guid}`}>
        <div className={styles.song}>
          {song.title}
        </div>
      </Link>
    );
  }

  return (
    <div className={styles.main}>
      <Breadcrumbs entry={album} />
      {album.songGuids.map(guid => buildSong(guid))}
    </div>
  );
}

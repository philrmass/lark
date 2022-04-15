import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import styles from './Album.module.css';

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
          {`${song.title} (${guid.slice(0, 4)})`}
        </div>
      </Link>
    );
  }

  return (
    <div className={styles.album}>
      <Link href="/" className='back'>{'< Home'}</Link>
      <h1>{album.title}</h1>
      {album.songGuids.map(guid => buildSong(guid))}
    </div>
  );
}

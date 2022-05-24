import { useEffect } from 'react';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import { queueSongs } from '../utilities/actions';
import styles from './Artist.module.css';

export default function Artist({ guid, entries, exec, setContent }) {
  const artist = entries[guid];

  useEffect(() => {
    if (artist) {
      setContent(artist);
    }
  }, [artist, setContent]);

  function onClick(e, album) {
    e.preventDefault();
    e.stopPropagation();
    const songs = album.songGuids.map(guid => entries[guid]);
    exec(queueSongs(songs, -1, true));
  }

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
          <button className='btn' onClick={(e) => onClick(e, album)}>
            Play
          </button>
          <div className={styles.title}>{album.title}</div>
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

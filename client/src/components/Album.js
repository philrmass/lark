import { useEffect } from 'react';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import { queueSong } from '../utilities/commands';
import styles from './Album.module.css';

export default function Album({ guid, entries, exec, setContent }) {
  const album = entries[guid];

  useEffect(() => {
    if (album) {
      setContent(album);
    }
  }, [album, setContent]);

  if (!album) {
    return <div>Loading...</div>;
  }

  if (album?.type !== 'album') {
    route('/', true);
  }

  function buildSong(guid) {
    const song = entries[guid];

    return (
      <div className={styles.song} onClick={() => exec(queueSong(song, -1, true))}>
        <button className='button'>Play</button>
        <div className={styles.title}>{song.title}</div>
        <Link href={`/songs/${song.guid}`} className='button'>Info</Link>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {album.songGuids.map(guid => buildSong(guid))}
    </div>
  );
}

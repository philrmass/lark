import { useEffect } from 'react';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import { queueSong } from '../utilities/actions';
import { toTime } from '../utilities/display';
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

  if (album.date) {
    console.log('ALBUM-DATE', album.date);
  }

  function buildSong(guid) {
    const song = entries[guid];

    return (
      <div className={styles.song} onClick={() => exec(queueSong(song, -1, true))}>
        <button className='btn'>Play</button>
        <div className={styles.title}>{song.title}</div>
        <Link href={`/songs/${song.guid}`} className='btn'>Info</Link>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.data}>
        <span>{toTime(album.duration)}</span>
      </div>
      {album.songGuids.map(guid => buildSong(guid))}
    </div>
  );
}

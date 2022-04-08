import { Link } from 'preact-router/match';
import styles from './Song.module.css';

export default function Song({ entry }) {
  return (
    <div>
      <Link href="/">Back to home</Link>
      <div>{entry.album}</div>
      <div>{entry.title}</div>
      <div className={styles.json}>{JSON.stringify(entry, null, 2)}</div>
    </div>
  );
  /*
{
      artist: artist.name,
      artistGuid: artist.guid,
      album: album.title,
      albumGuid: album.guid,
      bitrate: song.bitrate,
      duration: song.duration,
      guid: song.guid,
      path: song.path,
      size: song.size,
      songIndex: song.songIndex,
      title: song.title,
      type: 'song',
    }
    */
}

/*
import styles from './Album.module.css';

export default function Album({ entry, entries }) {
  return (
    <div>
      <Link href="/" className='back'>{`< Home`}</Link>
      <h1>{entry.title}</h1>
      {entry.songGuids.map(guid => buildSong(guid))}
      <div className={styles.json}>{JSON.stringify(entry, null, 2)}</div>
    </div>
  );
}
*/

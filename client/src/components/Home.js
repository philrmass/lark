import { Link } from 'preact-router/match';
import styles from './Home.module.css';

export default function Home({ artists }) {
  function buildArtist(artist) {
    return (
      <Link href={`/entries/${artist.guid}`}>
        <div className={styles.artist}>
          {`${artist.name} [${artist.guid}]`}
        </div>
      </Link>
    );
  }

  return (
    <div>
      {artists.map(artist => buildArtist(artist))}
      <div className={styles.json}>{JSON.stringify(artists, null, 2)}</div>
    </div>
  );
}

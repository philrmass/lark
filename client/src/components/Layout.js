import Router from 'preact-router';

import Entry from './Entry';
import Home from './Home';
import NotFound from './NotFound';
import Player from './Player';
import Queue from './Queue';
import styles from './Layout.module.css';

export default function Layout({
  artists,
  entries,
  songUrl,
  useSonos,
  execute,
  setUseSonos,
}) {
  return (
    <div>
      <div className={styles.player}>
        <Player songUrl={songUrl} />
        <button onClick={() => setUseSonos(v => !v)}>
          {`Sonos ${useSonos ? 'T' : 'F'}`}
        </button>
      </div>
      <Queue />
      <Router>
        <Home path='/' artists={artists} />
        <Entry path='/entries/:guid' entries={entries} execute={execute} />
        <NotFound default />
      </Router>
    </div>
  );
}

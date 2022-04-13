import Router from 'preact-router';

import styles from './Layout.module.css';
import Artists from './Artists';
import Entry from './Entry';
import NotFound from './NotFound';
import Player from './Player';
import Queue from './Queue';

export default function Layout({
  artists,
  entries,
  useSonos, //??? change to output
  exec,
  setUseSonos, //??? change to output
}) {
  return (
    <div>
      <div className={styles.player}>
        <Player exec={exec} />
        <button onClick={() => setUseSonos(v => !v)}>
          {`Sonos ${useSonos ? 'T' : 'F'}`}
        </button>
      </div>
      <Queue />
      <Router>
        <Artists path='/' artists={artists} />
        <Entry path='/entries/:guid' entries={entries} exec={exec} />
        <NotFound default />
      </Router>
    </div>
  );
}

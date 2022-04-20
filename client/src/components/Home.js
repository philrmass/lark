import Router from 'preact-router';

import styles from './Home.module.css';
import Album from './Album';
import Artist from './Artist';
import Artists from './Artists';
import NotFound from './NotFound';
import Output from './Output';
import Player from './Player';
import Queue from './Queue';
import Song from './Song';

export default function Home({
  artists,
  devices,
  entries,
  output,
  song,
  exec,
  setOutput,
}) {
  return (
    <div>
      <div className={styles.header}>
        <Player song={song} exec={exec} />
        <div className={styles.output}>
          <Output devices={devices} output={output} setOutput={setOutput} />
        </div>
      </div>
      <Queue />
      <Router>
        <Artists path='/' artists={artists} />
        <Artist path='/artists/:guid' entries={entries} />
        <Album path='/albums/:guid' entries={entries} />
        <Song path='/songs/:guid' entries={entries} exec={exec} />
        <NotFound default />
      </Router>
    </div>
  );
}

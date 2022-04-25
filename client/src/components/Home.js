import { useState } from 'react';
import Router from 'preact-router';

import styles from './Home.module.css';
import Album from './Album';
import Artist from './Artist';
import Artists from './Artists';
import Breadcrumbs from './Breadcrumbs';
import NotFound from './NotFound';
import Output from './Output';
import Player from './Player';
import Queue from './Queue';
import QueueStatus from './QueueStatus';
import Song from './Song';

export default function Home({
  artists,
  devices,
  entries,
  queue,
  index,
  playing,
  output,
  song,
  exec,
  setOutput,
}) {
  const [content, setContent] = useState(null);

  return (
    <>
      <div className={styles.fixed}>
        <div className={styles.header}>
          <Player song={song} playing={playing} exec={exec} />
          {playing ? 'playing' : 'NOT playing'}
          <div className={styles.output}>
            <Output devices={devices} output={output} setOutput={setOutput} />
          </div>
        </div>
        <QueueStatus queue={queue} index={index} exec={exec} />
        <Breadcrumbs entry={content} />
      </div>
      <div className={styles.content}>
        <Router>
          <Artists path='/' artists={artists} setContent={setContent} />
          <Artist path='/artists/:guid' entries={entries} setContent={setContent} />
          <Album path='/albums/:guid' entries={entries} exec={exec} setContent={setContent} />
          <Queue path='/queue' queue={queue} setContent={setContent} />
          <Song path='/songs/:guid' entries={entries} exec={exec} setContent={setContent} />
          <NotFound default />
        </Router>
      </div>
    </>
  );
}

import { useState } from 'react';
import Router, { route } from 'preact-router';

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
  volume,
  exec,
  changeOutput,
}) {
  const [content, setContent] = useState(null);

  function toggleQueue() {
    const queuePath = '/queue';
    const isShown = window.location.pathname === queuePath;

    if (isShown) {
      if (window.history.length > 0) {
        window.history.back();
      } else {
        route('/', true);
      }
    } else {
      route(queuePath);
    }
  }

  return (
    <>
      <div className={styles.fixed}>
        <div className={styles.header}>
          <Player song={song} playing={playing} exec={exec} />
          <div>{`[${volume}]`}</div>
          <div className={styles.output}>
            <Output devices={devices} output={output} changeOutput={changeOutput} />
          </div>
        </div>
        <QueueStatus
          queue={queue}
          index={index}
          exec={exec}
          toggleQueue={toggleQueue}
        />
        <Breadcrumbs entry={content} />
      </div>
      <div className={styles.content}>
        <Router>
          <Artists path='/' artists={artists} setContent={setContent} />
          <Artist path='/artists/:guid' entries={entries} setContent={setContent} />
          <Album path='/albums/:guid' entries={entries} exec={exec} setContent={setContent} />
          <Queue
            path='/queue'
            queue={queue}
            index={index}
            playing={playing}
            setContent={setContent}
            toggleQueue={toggleQueue}
          />
          <Song path='/songs/:guid' entries={entries} exec={exec} setContent={setContent} />
          <NotFound default />
        </Router>
      </div>
    </>
  );
}

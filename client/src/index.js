import { useEffect, useRef, useState } from 'preact/hooks';

import { getTime, setVolume as setVol, syncQueue } from './utilities/actions';
import { translateAction } from './utilities/commands';
import { useInterval } from './utilities/hooks';
import { exec as execPlayer } from './utilities/player';
import { exec as execQueue } from './utilities/queue';
import { exec as execSonos } from './utilities/sonos';
import { get } from './utilities/network';
import { useLocalStorage } from './utilities/storage';
import './reset.css';
import './index.css';
import Home from './components/Home';

export default function App() {
  const playerRef = useRef(null);
  const [artists, setArtists] = useLocalStorage('larkArtists', []);
  const [entries, setEntries] = useLocalStorage('larkEntries', {});
  const [queue, setQueue] = useLocalStorage('larkQueue', []);
  const [index, setIndex] = useLocalStorage('larkIndex', 0);
  const [devices, setDevices] = useLocalStorage('larkDevices', {});
  const [output, setOutput] = useLocalStorage('larkOutput', false);
  const [playing, setPlaying] = useLocalStorage('larkPlaying', false);
  const [time, setTime] = useLocalStorage('larkTime', false);
  const [volume, setVolume] = useState(20);
  const interval = playing ? 1000 : null;

  useInterval(() => {
    exec(getTime());
  }, interval);

  useEffect(() => {
    console.log(`Starting '${process.env.NODE_ENV}' with host '${process.env.API_HOST}'`);
    get(process.env.API_HOST, '/artists', setArtists);
    get(process.env.API_HOST, '/entries', setEntries);
    get(process.env.API_HOST, '/sonos', (data) => {
      setOutput(device => data[device?.id] ?? null);
      setDevices(data);
    });
  }, [setArtists, setDevices, setEntries, setOutput]);

  async function changeOutput(device) {
    //??? stop last device playing
    setOutput(device);
    await exec(syncQueue(), device);
    await exec(setVol(volume));
  }

  async function exec(action, device = output) {
    const state = { index, playing, queue, volume };
    const cmds = translateAction(action, state);

    update(execQueue(cmds, queue));

    if (device) {
      update(await execSonos(cmds, device));
    } else {
      update(await execPlayer(cmds, playerRef.current));
    }
  }

  function update(result) {
    const keys = Object.keys(result);
    for (const key of keys) {
      if (key === 'index') {
        setIndex(result.index);
      } else if (key === 'playing') {
        console.log(`__playing__(${result.playing})`);
        setPlaying(result.playing);
      } else if (key === 'queue') {
        const length = result.queue.length;
        if (index >= length) {
          setIndex(length - 1);
        }
        setQueue(result.queue);
      } else if (key === 'sonosQueue') {
        console.log(`__sonosQueue__(${result.sonosQueue?.length})`);
      } else if (key === 'time') {
        setTime(result.time);
      } else if (key === 'volume') {
        setVolume(result.volume);
      }
    }
  }

  return (
    <>
      <Home
        artists={artists}
        devices={devices}
        entries={entries}
        queue={queue}
        index={index}
        playing={playing}
        time={time}
        output={output}
        volume={volume}
        exec={exec}
        changeOutput={changeOutput}
      />
      <audio ref={playerRef} />
    </>
  );
}

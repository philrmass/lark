//??? sonos server actions return keys
//??? restore song status

//??? deploy to server

//??? add by-letter quick scroll on right-side
//??? add volume display
//??? add time display

//??? add search
//??? limit song title to X characters, add hover tooltip if longer

//??? add duration to album data
//??? add release date and duration display
//??? add next song coordination
//??? add art to album display

//??? add env vars to api host
//??? add spinner
import { useEffect, useRef, useState } from 'preact/hooks';

import { syncQueue } from './utilities/actions';
import { translateAction } from './utilities/commands';
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
  const [song, setSong] = useLocalStorage('larkSong', null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(20);

  useEffect(() => {
    console.log(`Starting '${process.env.NODE_ENV}' with host '${process.env.API_HOST}'`);
    get(process.env.API_HOST, '/artists', setArtists);
    get(process.env.API_HOST, '/entries', setEntries);
    get(process.env.API_HOST, '/sonos', (data) => {
      setOutput(device => data[device?.id] ?? null);
      setDevices(data);
    });
  }, [setArtists, setDevices, setEntries, setOutput]);

  function changeOutput(device) {
    //??? store last device playing
    setOutput(device);
    exec(syncQueue(), device);
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
      if (key === 'song') {
        console.log(`__song__(${result.song})`);
        setSong(result.song);
      } else if (key === 'index') {
        console.log(`__index__(${result.index})`);
        setIndex(result.index);
      } else if (key === 'playing') {
        console.log(`__playing__(${result.playing})`);
        setPlaying(result.playing);
      } else if (key === 'queue') {
        setQueue(result.queue);
      } else if (key === 'sonosQueue') {
        console.log(`__sonosQueue__(${result.sonosQueue.length})`);
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
        output={output}
        song={song}
        volume={volume}
        exec={exec}
        changeOutput={changeOutput}
      />
      <audio ref={playerRef} />
    </>
  );
}

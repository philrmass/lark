//??? adjustVolume > setVolume(volume) setVolume(volume)
//??? make clicking queue status a toggle, all area but clear
//
//??? syncQueue > [remove(all), add(song, index) x N, select(index), play]
//??? sync queue on device change
//??? sync queue on mismatch in update

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

import { translateAction } from './utilities/commands';
import { exec as execPlayer } from './utilities/player';
import { exec as execQueue, areQueuesInSync } from './utilities/queue';
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
  const [inSync, setInSync] = useState(true); //??? (false);

  useEffect(() => {
    console.log(`Starting '${process.env.NODE_ENV}' with host '${process.env.API_HOST}'`);
    get(process.env.API_HOST, '/artists', setArtists);
    get(process.env.API_HOST, '/entries', setEntries);
    get(process.env.API_HOST, '/sonos', (data) => {
      setOutput(device => data[device?.id] ?? null);
      setDevices(data);
    });
  }, [setArtists, setDevices, setEntries, setOutput]);

  async function exec(action) {
    const state = { index, playing, queue };
    const cmds = translateAction(action, state);

    update(execQueue(cmds, queue));

    if (output) {
      update(await execSonos(cmds, output));
    } else {
      update(await execPlayer(cmds, playerRef.current));
    }
  }

  function update(result) {
    const keys = Object.keys(result);
    for (const key of keys) {
      if (key === 'song') {
        console.log('UPDATE song', result.song);
        setSong(result.song);
      }
      if (key === 'index') {
        setIndex(result.index);
        console.log('UPDATE index', result.index);
      }
      if (key === 'playing') {
        setPlaying(result.playing);
        console.log('UPDATE playing', result.playing);
      }
      if (key === 'queue') {
        setQueue(result.queue);
        console.log('UPDATE queue', result.queue);
      }
      if (key === 'sonosQueue') {
        setInSync(areQueuesInSync(result.sonosQueue, queue));
        console.log('UPDATE sonosQueue', inSync, result.sonosQueue);
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
        inSync={inSync}
        exec={exec}
        setOutput={setOutput}
      />
      <audio ref={playerRef} />
    </>
  );
}

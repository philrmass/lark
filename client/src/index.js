//??? add <Breadcrumbs data={song} /> :: Artist, Album, Song, NotFound
//??? add play and info buttons to songs in list
//??? improve the layout, fix sizes
//??? add volume display

//??? clear queue on device if not matching
//??? add queue and queueing options

//??? add next song coordination
import { useEffect, useRef, useState } from 'preact/hooks';

import { exec as execPlayer } from './utilities/player';
import { exec as execSonos } from './utilities/sonos';
import { get } from './utilities/network';
import { useLocalStorage } from './utilities/storage';
import './reset.css';
import './index.css';
import Home from './components/Home';

//??? add env vars
const isDev = true;
const API_HOST = isDev ? 'http://0.0.0.0:4445' : '';

export default function App() {
  const playerRef = useRef(null);
  const [artists, setArtists] = useLocalStorage('larkArtists', []);
  const [entries, setEntries] = useLocalStorage('larkEntries', {});
  const [queue, setQueue] = useLocalStorage('larkQueue', []);
  const [devices, setDevices] = useLocalStorage('larkDevices', {});
  const [output, setOutput] = useLocalStorage('larkOutput', false);
  const [song, setSong] = useState('');

  useEffect(() => {
    get(API_HOST, '/artists', setArtists);
    get(API_HOST, '/entries', setEntries);
    get(API_HOST, '/sonos', (data) => {
      setOutput(device => data[device?.id] ?? null);
      setDevices(data);
    });
  }, [setArtists, setDevices, setEntries, setOutput]);

  async function exec(cmd) {
    if (output) {
      update(await execSonos(cmd, output));
    } else {
      update(await execPlayer(cmd, playerRef.current));
    }
  }

  function update(result) {
    if (result) {
      if (result.song) {
        setQueue(q => [result.song, ...q]);
        setSong(result.song);
      } else {
        console.warn('UNKNOWN-RESULT', result);
      }
    }
  }

  return (
    <>
      <Home
        artists={artists}
        devices={devices}
        entries={entries}
        output={output}
        song={song}
        exec={exec}
        setOutput={setOutput}
      />
      <div style={{ padding: '16px' }}>
        <audio ref={playerRef} controls />
      </div>
    </>
  );
}

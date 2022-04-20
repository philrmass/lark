//??? add play and info buttons to songs in list
//??? scroll songs in a list

//??? add queue and queueing options
//??? clear queue on device change
//??? sync queue when song added
//??? add queue overlay

//??? add volume display
//??? add time display

//??? add search
//??? add by-letter quick scroll on right-side

//??? add duration to album data
//??? add release date and duration display
//??? add next song coordination
//??? add art to album display

//??? add env vars to api host
//??? add spinner
import { useEffect, useRef } from 'preact/hooks';

import { exec as execPlayer } from './utilities/player';
import { exec as execSonos } from './utilities/sonos';
import { get } from './utilities/network';
import { useLocalStorage } from './utilities/storage';
import './reset.css';
import './index.css';
import Home from './components/Home';

//??? add env vars
const isDev = true;
const API_HOST = isDev ? 'http://192.168.1.29:4445' : '';

export default function App() {
  const playerRef = useRef(null);
  const [artists, setArtists] = useLocalStorage('larkArtists', []);
  const [entries, setEntries] = useLocalStorage('larkEntries', {});
  const [queue, setQueue] = useLocalStorage('larkQueue', []);
  const [devices, setDevices] = useLocalStorage('larkDevices', {});
  const [output, setOutput] = useLocalStorage('larkOutput', false);
  const [song, setSong] = useLocalStorage('larkSong', null);

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
      <audio ref={playerRef} />
    </>
  );
}

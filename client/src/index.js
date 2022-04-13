//??? add play/pause to sonos route
//??? save devices in local storage
//??? add output selection modal
//??? select device as output, save in local storage
//??? add <Breadcrumbs data={song} /> :: Artist, Album, Song, NotFound
//??? move entries route to server, parse entries on server, remove unneeded data, add new get
import { useEffect, useRef, useState } from 'preact/hooks';

import { parseArtistEntries } from './utilities/data';
import { get } from './utilities/network';
import './reset.css';
import './index.css';
import Home from './components/Home';

export default function App() {
  const isDev = true;
  const host = isDev ? 'http://0.0.0.0:4445' : '';
  const player = useRef(null);
  const [artists, setArtists] = useState([]);
  const [entries, setEntries] = useState({});
  const [song, setSong] = useState('');
  const [devices, setDevices] = useState({});
  const [output, setOutput] = useState(false);

  useEffect(() => {
    get(host, '/artists', (data) => {
      setArtists(data);
      setEntries(parseArtistEntries(data));
    });
    get(host, '/sonos', setDevices);
  }, [host]);

  async function exec(cmd) {
    if (cmd.type === 'addSong') {
      if (output) {
        const encodedPath = encodeURIComponent(cmd.song.path);
        const data = {
          ipAddress: devices.Kitchen,
          path: encodedPath,
          action: 'play',
        };
        const params = {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
        await fetch(`${host}/sonos/`, params);
        console.log('SEND', data, params);
      } else {
        try {
          const encodedPath = encodeURIComponent(cmd.song.path);
          const response = await fetch(`${host}/songs/${encodedPath}`);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          player.current.src = url;
          player.current.play();
          setSong({ ...cmd.song, url });
        } catch (err) {
          console.error(`Error fetching song (${cmd.path}):`, err);
        }
      }
    } else if (cmd.type === 'togglePlay') {
      if (output) {
        console.warn('TOGGLE PLAY SONOS', cmd);
      } else {
        player.current.paused ? player.current.play() : player.current.pause();
      }
    } else {
      console.warn('UNKNOWN CMD', cmd);
    }
  }

  return (
    <>
      <Home
        artists={artists}
        entries={entries}
        output={output}
        song={song}
        exec={exec}
        setOutput={setOutput}
      />
      <div style={{ padding: '32px' }}>
        <audio ref={player} controls />
        <div>{Object.keys(devices)}</div>
      </div>
    </>
  );
}

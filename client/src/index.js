import { useEffect, useRef, useState } from 'preact/hooks';
import { parseArtistEntries } from './utilities/data';

import Layout from './components/Layout';
import './reset.css';
import './index.css';

export default function App() {
  const isDev = true;
  const host = isDev ? 'http://0.0.0.0:4445' : '';
  const player = useRef(null);
  const [artists, setArtists] = useState([]);
  const [entries, setEntries] = useState({});
  const [song, setSong] = useState('');
  const [devices, setDevices] = useState({});
  const [useSonos, setUseSonos] = useState(false);

  useEffect(() => {
    //??? move to hook
    const get = async (host, path, callback) => {
      try {
        const url = `${host}${path}`;

        const response = await fetch(url);
        const data = await response.json() ?? [];

        if (data) {
          callback(data);
        }
      } catch (err) {
        console.error(`Error getting ${path}`, err);
      }
    };

    //??? move entries to server
    const gotArtists = (data) => {
      setArtists(data);
      setEntries(parseArtistEntries(data));
    };

    get(host, '/artists', gotArtists);
    get(host, '/sonos', setDevices);
  }, [host]);

/*
  useEffect(() => {
    if (song !== player.current.src) {
      player.current.src = song;
      player.current.play();
    }
  }, [song]);
  */

  async function exec(cmd) {
    console.log('DEV', devices);

    if (cmd.type === 'addSong') {
      if (useSonos) {
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
      if (useSonos) {
        console.warn('TOGGLE PLAY SONOS', cmd);
      } else {
        console.warn('TOGGLE PLAY LOCAL', cmd);
      }
    } else {
      console.warn('UNKNOWN CMD', cmd);
    }
  }

  return (
    <>
      <Layout
        artists={artists}
        entries={entries}
        useSonos={useSonos}
        exec={exec}
        setUseSonos={setUseSonos}
      />
      <audio ref={player} controls />
    </>
  );
}

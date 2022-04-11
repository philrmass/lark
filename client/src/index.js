import { useEffect, useState } from 'preact/hooks';
import { parseArtistEntries } from './utilities/data';

import Layout from './components/Layout';
import './reset.css';
import './index.css';

export default function App() {
  const isDev = true;
  const host = isDev ? 'http://0.0.0.0:4445' : '';
  const [artists, setArtists] = useState([]);
  const [entries, setEntries] = useState({});
  const [songUrl, setSongUrl] = useState('');
  const [devices, setDevices] = useState({});
  const [useSonos, setUseSonos] = useState(false);

  useEffect(() => {
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

    const gotArtists = (data) => {
      setArtists(data);
      setEntries(parseArtistEntries(data));
    };

    get(host, '/artists', gotArtists);
    get(host, '/sonos', setDevices);
  }, [host]);

  async function execute(cmd) {
    //??? console.log('CMD', cmd);
    console.log('DEV', devices);

    if (cmd.type === 'play') {
      if (useSonos) {
        const encodedPath = encodeURIComponent(cmd.path);
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
          const encodedPath = encodeURIComponent(cmd.path);
          const response = await fetch(`${host}/songs/${encodedPath}`);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          setSongUrl(url);
        } catch (err) {
          console.error(`Error fetching song (${cmd.path}):`, err);
        }
      }
    }
  }

  return (
    <div>
      <Layout
        artists={artists}
        entries={entries}
        songUrl={songUrl}
        useSonos={useSonos}
        execute={execute}
        setUseSonos={setUseSonos}
      />
    </div>
  );
}

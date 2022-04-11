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
  const [useSonos, setUseSonos] = useState(false);

  useEffect(() => {
    const artistsPath = '/artists';
    const getArtists = async (host, path) => {
      try {
        const url = `${host}${path}`;

        const response = await fetch(url);
        const data = await response.json() ?? [];

        if (data) {
          setArtists(data);
          setEntries(parseArtistEntries(data));
        }
      } catch (err) {
        console.error('Error getting artists', err);
      }
    };

    getArtists(host, artistsPath);
  }, [host]);

  async function execute(cmd) {
    //??? console.log('CMD', cmd);

    if (cmd.type === 'play') {
      if (useSonos) {
        console.log('SONOS');
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

import { useEffect, useState } from 'preact/hooks';
import Router from 'preact-router';
import Entry from './components/Entry';
import Home from './components/Home';
import NotFound from './components/NotFound';
import './index.css';

export default function App() {
  const isDev = true;
  const host = isDev ? 'http://0.0.0.0:4445' : '';
  const path = '/artists';
  const [artists, setArtists] = useState([]);
  const [entries, setEntries] = useState({});

  useEffect(() => {
    const getArtists = async (host, path) => {
      try {
        const isDev = true;
        const url = `${host}${path}`;

        const response = await fetch(url);
        const data = await response.json() ?? [];

        if (data) {
          setArtists(data);
          console.log('ARTISTS:', data.map(a => a.name));
        }
      } catch (err) {
        console.error('Error getting artists', err);
      }
    };

    getArtists(host, path);
  }, []);

  return (
    <Router>
      <Home path='/' artists={artists} />
      <Entry path='/entries/:guid' entries={entries} />
      <NotFound default />
    </Router>
  );
}

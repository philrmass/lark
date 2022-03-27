import { useEffect, useState } from 'react';
import './style';

export default function App() {
  const isDev = true;
  const host = isDev ? 'http://0.0.0.0:4445' : '';
  const path = '/artists';
  const [artists, setArtists] = useState([]);

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
    <div>
      <h1>Hello, World!</h1>
      <div>yo</div>
      <div>{JSON.stringify(artists, null, 2)}</div>
    </div>
  );
}

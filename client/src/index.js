import { useEffect, useState } from 'preact/hooks';
import Router from 'preact-router';
import Entry from './components/Entry';
import Home from './components/Home';
import NotFound from './components/NotFound';
import './reset.css';
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
          setEntries(parseArtistEntries(data));
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

function parseArtistEntries(artists) {
  return artists.reduce((all, artist) => {
    const artistEntry = {
      type: 'artist',
      name: artist.name,
      albumGuids: artist.albums.map(album => album.guid),
    };
    const albumEntries = parseAlbumEntries(artist.albums, artist);

    return {
      ...all,
      [artist.guid]: artistEntry,
      ...albumEntries,
    };
  }, {});
}

function parseAlbumEntries(albums, artist) {
  return albums.reduce((all, album) => {
    const albumEntry = {
      artist: artist.name,
      artistGuid: artist.guid,
      type: 'album',
      title: album.title,
      songGuids: album.songs.map(song => song.guid),
    };
    const songEntries = parseSongEntries(album.songs, album, artist);

    return {
      ...all,
      [album.guid]: albumEntry,
      ...songEntries,
    };
  }, {});
}

function parseSongEntries(songs, album, artist) {
  return songs.reduce((all, song) => {
    const songEntry = {
      artist: artist.name,
      artistGuid: artist.guid,
      album: album.title,
      albumGuid: album.guid,
      bitrate: song.bitrate,
      duration: song.duration,
      guid: song.guid,
      path: song.path,
      size: song.size,
      songIndex: song.songIndex,
      title: song.title,
      type: 'song',
    };

    return {
      ...all,
      [song.guid]: songEntry,
    };
  }, {});
}

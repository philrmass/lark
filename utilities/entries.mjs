export function parseArtistEntries(artists) {
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
      date: album.date,
      duration: album.duration,
      type: 'album',
      title: album.title,
      songGuids: album.songs.map(song => song.guid),
    };
    if (albumEntry.date) {
      console.log('AE', albumEntry.title, albumEntry.date);
    }
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

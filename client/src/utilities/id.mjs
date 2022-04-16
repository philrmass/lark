import { v5 as uuidv5 } from 'uuid';

/*
function addIds(library) {
  return library.map((artist) => {
    artist.id = calcItemId(artist);
    artist.albums = artist.albums.map((album) => {
      album.id = calcItemId(album);
      album.songs = album.songs.map((song) => {
        song.id = calcItemId(song);
        return song;
      });
      return album;
    });
    return artist;
  });
}

function calcItemId(item) {
  if (!item) {
    return '';
  }
  if (item.albums) {
    return calcGuid(`${item.name}`);
  } else if (item.songs) {
    return calcGuid(`${item.artist}${item.title}`);
  }
  return item.guid;
}

function calcGuid(value) {
  const namespaceGuid = '4986d826-5b55-48a9-8483-eb31cdac06c6';
  return uuidv5(value, namespaceGuid);
}

function scrollIntoView(id) {
  if (id) {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }
}

module.exports.addIds = addIds;
module.exports.calcItemId = calcItemId;
module.exports.calcGuid = calcGuid;
module.exports.scrollIntoView = scrollIntoView;
*/

export function calcGuid(value) {
  const namespaceGuid = '4986d826-5b55-48a9-8483-eb31cdac06c6';
  return uuidv5(value || '', namespaceGuid);
}

//const fsp = require('fs').promises;
//const md = require('./metadata');
import jsPath from 'path';

export function isSong(path) {
  return (jsPath.extname(path) === '.mp3');
}

/*
function readSongData(path) {
  let parsed = pth.parse(path);
  const dirs = parsed.dir.split(pth.sep);
  const artist = dirs.length >= 2 ? dirs[dirs.length - 2] : '';
  const rawAlbum = dirs.length >= 1 ? dirs[dirs.length - 1] : '';
  const album = rawAlbum.replace(/\s+\[Explicit\]/, '');
  const rawTitle = parsed.base;
  const titleParts = rawTitle.match(/\s*((\d+)-)?(\d*)\s+-?\s?(.*)\.(\w+)/);
  const albumIndex = parseInt(titleParts[1], 10) || 1;
  const songIndex = parseInt(titleParts[3], 10) || 0;
  const title = titleParts[4].replace(/\s+\[Explicit\]/, '');

  return {
    artist,
    album,
    title,
    albumIndex,
    songIndex,
    path,
    noMetadata: true,
  };
}

async function readSongMetadata(path) {
  const buffer = await fsp.readFile(path);
  const byteBuffer = new Uint8Array(buffer).buffer;
  return md.readMetadata(byteBuffer);
}

function updateSong(song, metadata) {
  const path = song.path;
  const guid = song.guid;
  const size = song.size;
  const artist = metadata.TPE2 || metadata.TPE1 || song.artist;
  const album = metadata.TALB || song.album;
  const title = metadata.TIT2 || song.title;
  const albumIndex = getIndex(metadata.TPOS) || song.albumIndex;
  const songIndex = getIndex(metadata.TRCK) || song.songIndex;
  const date = getDate(metadata);
  const noMetadata = false;
  const updated = {
    path,
    guid,
    size,
    artist,
    album,
    title,
    albumIndex,
    songIndex,
    date,
    noMetadata,
  };
  return updated;
}

function getIndex(data) {
  if (!data) {
    return;
  }
  const indexStr = data.split('/')[0];
  return indexStr && parseInt(indexStr);
}

function getDate(metadata) {
  if (metadata.TDRL) {
    return metadata.TDRL;
  }
  if (metadata.TDRC) {
    return metadata.TDRC;
  }
  if (metadata.TYER && metadata.TDAT) {
    let day = metadata.TDAT.slice(0, 2);
    let month = metadata.TDAT.slice(2, 4);
    return `${metadata.TYER}-${month}-${day}`;
  } else if (metadata.TYER) {
    return `${metadata.TYER}-xx-xx`;
  }
}

module.exports.isSong = isSong;
module.exports.readSongData = readSongData;
module.exports.readSongMetadata = readSongMetadata;
module.exports.updateSong = updateSong;
*/

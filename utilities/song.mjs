import { promises as fs } from 'fs';
import jsPath from 'path';

import { parseMetadata } from './metadata.mjs';

export function isSong(path) {
  return (jsPath.extname(path) === '.mp3');
}

export function isComplete(song) {
  if (song) {
    return song.artist && 
      song.album &&
      song.title;
  }

  return false;
}

export function readPathData(path) {
  const parsed = jsPath.parse(path);
  const dirs = parsed.dir.split(jsPath.sep);
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
    hasMetadata: false,
  };
}

export async function readMetadata(path) {
  const buffer = await fs.readFile(path);
  const byteBuffer = new Uint8Array(buffer).buffer;
  //console.log('PM', path);
  const metadata = parseMetadata(byteBuffer, path);
  return interpretMetadata(metadata);
}

function interpretMetadata(metadata) {
  const artist = metadata.TPE2 || metadata.TPE1;
  const album = metadata.TALB;
  const title = metadata.TIT2;
  const albumIndex = getIndex(metadata.TPOS);
  const songIndex = getIndex(metadata.TRCK);
  const date = getDate(metadata);
  const hasMetadata = true;

  return {
    artist,
    album,
    title,
    albumIndex,
    songIndex,
    date,
    hasMetadata,
  };
}

function getIndex(value) {
  if (!value) {
    return;
  }
  const indexStr = value.split('/')[0];
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

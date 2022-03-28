import { promises as fs } from 'fs';
import * as musicMetadata from 'music-metadata';
import jsPath from 'path';

import { loadData, saveData } from './file.mjs';
import { isComplete, isSong, readMetadata, readPathData } from './song.mjs';
import { calcGuid } from '../client/src/utilities/id.mjs';
import { byDateTitle, byName } from '../client/src/utilities/sort.mjs';

export async function initLibrary(config, newPaths, updateAll = false) {
  const oldPaths = await loadData(config.libraryPath) ?? [];
  const unique = newPaths.filter(path => !oldPaths.includes(path));
  const paths = oldPaths.concat(unique);
  await saveData(config.libraryPath, paths);

  const oldSongsByGuid = updateAll ? {} : (await loadData(config.songsPath) ?? {});
  const newSongFiles = (await Promise.all(paths.map(path => findSongFiles(path)))).flat();
  const songsByGuid = await updateSongs(oldSongsByGuid, newSongFiles);
  await saveData(config.songsPath, songsByGuid);

  return songsByGuid;
}

async function findSongFiles(path) {
  try {
    const stat = await fs.lstat(path);

    if (stat.isFile() && isSong(path)) {
      return [{
        path,
        size: stat.size,
        guid: calcGuid(path),
      }];
    } else if (stat.isDirectory()) {
      const items = await fs.readdir(path);
      const paths = items.map(item => jsPath.join(path, item));
      return (await Promise.all(paths.map(path => findSongFiles(path)))).flat();
    } else {
      return [];
    }
  } catch (err) {
    console.error(`findSongs [${err}]`);
    return [];
  }
}

async function updateSongs(oldByGuid, newFiles) {
  return await newFiles.reduce(async (byGuidPromise, file) => {
    const byGuid = await byGuidPromise;
    const existing = byGuid[file.guid] ?? oldByGuid[file.guid];
    const complete = isComplete(existing);
    const pathData = complete ? existing : readPathData(file.path);
    const metadata = complete ? {} : await readMetadata(file.path);
    const data = await musicMetadata.parseFile(file.path);

    if (!complete) {
      console.log(`Imported ${file.path}`);
    }

    return {
      ...byGuid,
      [file.guid]: {
        ...file,
        ...pathData,
        ...metadata,
        bitrate: data.format.bitrate,
        duration: data.format.duration,
      },
    };
  }, {});
}

export function parseArtists(songsByGuid) {
  const songs = Object.values(songsByGuid);
  
  const artistsObj = songs.reduce((artists, song) => {
    if (!artists[song.artist]) {
      artists[song.artist] = { name: song.artist, songs: [] };
    }
    artists[song.artist].songs.push(song);
    return artists;
  }, {});

  const artistsSongs = Object.values(artistsObj).sort(byName);

  const artists = artistsSongs.map((artist) => {
    const albumsObj = artist.songs.reduce((albums, song) => {
      if (!albums[song.album]) {
        albums[song.album] = {
          artist: artist.name,
          title: song.album,
          guid: calcGuid(`${artist.name}/${song.album}`),
          songs: []
        };
      }
      albums[song.album].songs.push(song);
      if (song.date) {
        albums[song.album].date = song.date;
      }
      return albums;
    }, {});
    const albumsSorted = Object.values(albumsObj).sort(byDateTitle);

    const albums = albumsSorted.map((album) => {
      album.songs = album.songs.sort((a, b) => {
        if (a.albumIndex !== b.albumIndex) {
          return a.albumIndex - b.albumIndex;
        }
        return a.songIndex - b.songIndex;
      });
      return album;
    });

    return {
      name: artist.name,
      albums,
      guid: calcGuid(artist.name),
    };
  });

  return artists;
}

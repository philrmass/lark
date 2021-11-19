import { promises as fs } from 'fs';
import jsPath from 'path';

import { loadData, saveData } from './file.mjs';
import { isSong } from './song.mjs';
import { calcGuid } from '../client/src/utilities/id.mjs';

export async function initLibrary(config, newPaths, updateAll = false) {
  const start = Date.now();

  const oldPaths = await loadData(config.libraryPath) ?? [];
  const unique = newPaths.filter(path => !oldPaths.includes(path));
  const paths = oldPaths.concat(unique);
  await saveData(config.libraryPath, paths);
  console.log(`Loading library from [${paths}]`);

  const oldSongsByGuid = updateAll ? {} : (await loadData(config.songsPath) ?? {});
  const newSongFiles = (await Promise.all(paths.map(path => findSongFiles(path)))).flat();

  console.log(`old-songs [${Object.keys(oldSongsByGuid).length}]`);
  console.log(`new-songs [${newSongFiles.length}]`);
  console.log('songs', JSON.stringify(newSongFiles, null, 2));
  //await saveData(config.songsPath, songs);

  return {};
  /*
  let added = 0;
  let duplicates = 0;
  let copied = 0;
  for (const newSong of newSongs) {
    if (songsByGuid[newSong.guid]) {
      duplicates++;
    }
    if (!oldSongsByGuid[newSong.guid]) {
      songsByGuid[newSong.guid] = {
        ...newSong,
        ...sng.readSongData(newSong.path),
      };
      added++;
    } else {
      songsByGuid[newSong.guid] = oldSongsByGuid[newSong.guid];
      copied++;
    }
  }
  let removed = Object.keys(oldSongsByGuid).length + duplicates - copied;
  const songs = Object.values(songsByGuid);

  global.songsByGuid = songsByGuid;
  global.artists = parseArtists(songs);

  await saveFileData(songsFilePath, { songsByGuid });
  const time = Date.now() - start;
  console.log(` Found ${newSongs.length} songs (${added} added, ${removed} removed, ${duplicates} duplicates) in ${time} ms`);

  console.log(` Import ${updateAllMetadata ? 'ALL' : 'new'} metadata`);
  await importMetadata(songs, updateAllMetadata);
  console.log(' Import complete');
  */
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
    }
  } catch (err) {
    console.error(`findSongs [${err}]`);
    return [];
  }
}

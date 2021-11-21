import { promises as fs } from 'fs';
import jsPath from 'path';

import { loadData, saveData } from './file.mjs';
import { isComplete, isSong, readPathData } from './song.mjs';
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

  const { songsByGuid, stats } = combineSongs(oldSongsByGuid, newSongFiles);
  //console.log('SBG', JSON.stringify(songsByGuid, null, 2), '\nSTATS', JSON.stringify(stats, null, 2));

  //await saveData(config.songsPath, songs);
  //await saveFileData(songsFilePath, { songsByGuid });

  //const time = Date.now() - start;
  //console.log(` Found ${newSongs.length} songs (${added} added, ${removed} removed, ${duplicates} duplicates) in ${time} ms`);

  //console.log(` Import ${updateAllMetadata ? 'ALL' : 'new'} metadata`);
  //await importMetadata(songs, updateAllMetadata);
  //console.log(' Import complete');

  return {};
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

async function combineSongs(oldByGuid, newFiles) {
  const songsByGuid = newFiles.reduce((byGuid, file) => {
    const existing = byGuid[file.guid] ?? oldByGuid[file.guid];
    const data = isComplete(existing) ? existing : readPathData(file.path);

    return {
      ...byGuid,
      [file.guid]: {
        ...file,
      },
    };
  }, {});

  console.log('SBG', songsByGuid);
  //duplicates = newFiles.length - Object.keys(byGuid).length
  //let added = 0;
  //let copied = 0;
  //let removed = Object.keys(oldSongsByGuid).length + duplicates - copied;
  return {};
}

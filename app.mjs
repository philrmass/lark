import fs from 'fs';
import Koa from 'koa';
import KoaRouter from '@koa/router';

import config from './config.mjs';
import { initLibrary } from './utilities/library.mjs';

const port = 4445;
let songsByGuid = {};

async function run() {
  const newPaths = [...process.argv].slice(2);
  songsByGuid = await initLibrary(config, newPaths);
  //global.artists = parseArtists(songs);

  if (Object.keys(songsByGuid).length === 0) {
    console.error('No songs found');
    return;
  }

  console.log('Starting koa server');
  const app = new Koa();

  var router = KoaRouter();
  router.get('/songs/:guid', getSong);

  console.log(`Adding routes, listening on port ${port}`);
  app.use(router.routes());
  app.listen(port);
}

async function getSong(ctx) {
  const guid = ctx.params.guid;
  const path = getSongPath(guid);
  console.log(`[${guid}] = [${path}]`);

  try {
    if (fs.existsSync(path)) {
      ctx.body = fs.createReadStream(path);
      //ctx.attachment(path);
    } else {
      ctx.throw(400, `Song not found [${guid}]`);
    }
  } catch (err) {
    ctx.throw(500, err);
  }
};

function getSongPath(guid) {
  switch (guid) {
    case 'nirvana.mp3':
      return '/Users/philmass/Music/Library/Nirvana/In Utero/12 All Apologies.mp3';
    default:
      return null;
  }
}

run();

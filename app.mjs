import fs from 'fs';
import Koa from 'koa';
import KoaRouter from '@koa/router';
import cors from '@koa/cors';

import config from './config.mjs';
import { initLibrary, parseArtists } from './utilities/library.mjs';

const port = 4445;
let songsByGuid = {};
let artists = [];

async function run() {
  const start = Date.now();

  const newPaths = [...process.argv].slice(2);
  songsByGuid = await initLibrary(config, newPaths);
  console.log(`Loaded ${Object.keys(songsByGuid).length} songs in ${toSecs(start, Date.now())} seconds`);

  if (Object.keys(songsByGuid).length === 0) {
    console.error('No songs found');
    return;
  }

  artists = parseArtists(songsByGuid);
  console.log(`Parsed ${artists.length} artists in ${toSecs(start, Date.now())} seconds`);

  console.log('Starting koa server');
  const app = new Koa();
  app.use(cors());

  var router = KoaRouter();
  router.get('/songs', getSongs);
  router.get('/songs/:path', getSong);
  router.get('/artists', getArtists);

  console.log(`Adding routes, listening on port ${port}`);
  app.use(router.routes());
  app.listen(port);
}

function toSecs(start, end) {
  const secs = (end - start) / 1000;
  return secs.toFixed(3);
}

//??? reload
/*
router.post('/', async function(req, res, next) {
  const reload = req.body.reloadMetadata;
  if (reload) {
    lib.reconcileLibrary(true);
    res.send(JSON.stringify([]));
  } else {
    await lib.reconcileLibrary();
    const artists = global.artists || [];
    res.send(JSON.stringify(artists));
  }
});
*/

async function getSongs(ctx) {
  try {
    ctx.body = JSON.stringify(songsByGuid);
    ctx.response.set('content-type', 'application/json');
  } catch (err) {
    ctx.throw(500, err);
  }
}

async function getSong(ctx) {
  const path = decodeURIComponent(ctx.params.path);
  console.log(`[${path}]`);

  try {
    if (fs.existsSync(path)) {
      ctx.body = fs.createReadStream(path);
      ctx.attachment(path);
    } else {
      ctx.throw(400, `Song not found [${path}]`);
    }
  } catch (err) {
    ctx.throw(500, err);
  }
};

async function getArtists(ctx) {
  try {
    ctx.body = JSON.stringify(artists);
    ctx.response.set('content-type', 'application/json');
  } catch (err) {
    ctx.throw(500, err);
  }
}

run();

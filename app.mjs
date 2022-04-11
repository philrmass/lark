import fs from 'fs';
import koa from 'koa';
import koaRouter from '@koa/router';
import cors from '@koa/cors';
import serve from 'koa-static';
//import bodyParser from 'koa-body';
//"koa-body": "^4.2.0",

import config from './config.mjs';
import { getDevices } from './routes/sonos.mjs';
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
  const app = new koa();
  app.use(cors());
  app.use(serve('client/build'));

  const router = koaRouter();
  //router.get('/songs', getSongs);
  router.get('/songs/:path', getSong);
  router.get('/artists', getArtists);
  router.get('/sonos', getDevices);
  //router.post('/astronaut/space_walks', bodyParser(), validateTime);

  app.use(router.routes());
  app.listen(port);
  console.log(`Listening on port ${port}`);
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

/*
// ??? add back as getEntries
async function getSongs(ctx) {
  try {
    ctx.body = JSON.stringify(songsByGuid);
    ctx.response.set('content-type', 'application/json');
  } catch (err) {
    ctx.throw(500, err);
  }
}
*/

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

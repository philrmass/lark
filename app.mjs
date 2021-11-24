import fs from 'fs';
import Koa from 'koa';
import KoaRouter from '@koa/router';

import config from './config.mjs';
import { initLibrary, parseArtists } from './utilities/library.mjs';

const port = 4445;
let songsByGuid = {};
let artists = {};

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
  console.log(`Parsed ${Object.keys(artists).length} artists in ${toSecs(start, Date.now())} seconds`);

  console.log('Starting koa server');
  const app = new Koa();

  var router = KoaRouter();
  router.get('/songs/:guid', getSong);

  console.log(`Adding routes, listening on port ${port}`);
  app.use(router.routes());
  app.listen(port);
}

function toSecs(start, end) {
  const secs = (end - start) / 1000;
  return secs.toFixed(3);
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

/*
var express = require('express');
const lib = require('../utilities/library.js');
var router = express.Router();

router.get('/', function(req, res, next) {
  const artists = global.artists || [];
  res.send(JSON.stringify(artists));
});

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

router.get('/:artist', function(req, res, next) {
  const artist = global.artists && global.artists[req.params.artist] || {};
  res.send(JSON.stringify(artist));
});

module.exports = router;
*/

/*
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const songsByGuid = global.songsByGuid || {};
  res.send(JSON.stringify(Object.values(songsByGuid)));
});

router.get('/:path', function(req, res, next) {
  console.log(` Load '${getSongDescription(req.params.path)}'`);
  res.download(req.params.path);
});

function getSongDescription(path) {
  const parts = path.split('\\');
  const last = parts.slice(-3);
  return last.join(':');
}

module.exports = router;
*/

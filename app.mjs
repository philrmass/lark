import fs from 'fs';
import koa from 'koa';
import koaRouter from '@koa/router';
import cors from '@koa/cors';
import serve from 'koa-static';
import koaBody from 'koa-body';
import ytdl from 'ytdl-core';

import config from './config.mjs';
import { getDevices, postAction } from './routes/sonos.mjs';
import { parseArtistEntries } from './utilities/entries.mjs';
import { initLibrary, parseArtists } from './utilities/library.mjs';

const port = 4445;
let artists = [];
let entries = {};

async function run() {
  const start = Date.now();

  const newPaths = [...process.argv].slice(2);
  const songsByGuid = await initLibrary(config, newPaths);
  console.log(`Loaded ${Object.keys(songsByGuid).length} songs in ${toSecs(start, Date.now())} seconds`);

  if (Object.keys(songsByGuid).length === 0) {
    console.error('No songs found');
    return;
  }

  artists = parseArtists(songsByGuid);
  console.log(`Parsed ${artists.length} artists in ${toSecs(start, Date.now())} seconds`);

  entries = parseArtistEntries(artists);
  console.log(`Created ${Object.keys(entries).length} etnries`);

  console.log('Starting koa server');
  const app = new koa();
  app.use(cors());
  app.use(serve('client/build'));

  const router = koaRouter();
  router.get('/songs/:path', getSong);
  router.get('/artists', getArtists);
  router.get('/entries', getEntries);
  router.get('/sonos', getDevices);
  router.post('/sonos', koaBody(), postAction);

  app.use(router.routes());
  app.listen(port);
  console.log(`Listening on port ${port}`);
}

function toSecs(start, end) {
  const secs = (end - start) / 1000;
  return secs.toFixed(3);
}

function getEntries(ctx) {
  try {
    console.log(`getEntries (${Object.keys(entries).length})`);

    ctx.body = JSON.stringify(entries);
    ctx.response.set('content-type', 'application/json');
  } catch (err) {
    ctx.throw(500, err);
  }
}

function getSong(ctx) {
  try {
    const path = decodeURIComponent(ctx.params.path);
    console.log(`getSong '${path}'`);

    if (fs.existsSync(path)) {
      ctx.body = fs.createReadStream(path);
      ctx.attachment(path);
    } else {
      ctx.throw(400, `Song not found [${path}]`);
    }
  } catch (err) {
    ctx.throw(500, err);
  }
}

function getArtists(ctx) {
  console.log(`getArtists (${Object.keys(artists).length})`);

  try {
    ctx.body = JSON.stringify(artists);
    ctx.response.set('content-type', 'application/json');
  } catch (err) {
    ctx.throw(500, err);
  }
}

export async function getYoutube(ctx) {
  try {
    const path = decodeURIComponent(ctx.params.path);
    console.log(`[${path}]`);

    const url2 = 'https://www.youtube.com/watch?v=u8pVZ5hTGJQ';
    const info = await ytdl.getInfo(url2);
    const formats = ytdl.filterFormats(info.formats, 'audioonly');
    const format = formats[0];
    const yt = ytdl(url2, { format });
    ctx.body = yt;
    ctx.attachment(url2);
  } catch (err) {
    ctx.throw(500, err);
  }
}

run();

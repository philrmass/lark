const fs = require('fs');
const Koa = require('koa');
const KoaRouter = require('@koa/router');

const port = 4445;

async function run() {
  console.log('Starting koa server');
  const app = new Koa();

  var router = KoaRouter();
  router.get('/songs/:guid', getSong);

  console.log(`Adding routes, listening on port ${port}`);
  app.use(router.routes());
  app.listen(port);
}

run();

async function getSong(ctx) {
  const guid = ctx.params.guid;
  const path = getSongPath(guid);
  console.log(`[${guid}] = [${path}]`);

  try {
    if (fs.existsSync(path)) {
      ctx.body = fs.createReadStream(path);
      ctx.attachment(path);
    } else {
      ctx.throw(400, `Song not found [${guid}]`);
    }
  } catch (err) {
    ctx.throw(500, err);
  }
};

function getSongPath(guid) {
  switch (guid) {
    case 'nirvana':
      return '/Users/philmass/Music/Library/Nirvana/In Utero/12 All Apologies.mp3';
    default:
      return null;
  }
}

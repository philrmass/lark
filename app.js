const Koa = require('koa');
const KoaRouter = require('@koa/router');

const port = 4445;
const nirvanaPath = '/Users/philmass/Music/Library/Nirvana/In Utero/12 All Apologies.mp3';

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

  console.log('GUID', guid, 'PATH', path);

  ctx.body = 'This is your song';
};

function getSongPath(guid) {
  switch (guid) {
    case 'nirvana':
      return nirvanaPath;
  }
}


/*
router.get('/downloads/:version/:file', async function(ctx) {
  const fileName = `${__dirname}/downloads/${ctx.params.version}/${ctx.params.file}`;
  try {
    if (fs.existsSync(fileName)) {
      ctx.body = fs.createReadStream(fileName);
      ctx.attachment(fileName);
    } else {
      ctx.throw(400, "Requested file not found on server");
    }
  } catch(error) {
    ctx.throw(500, error);
  }  
});
*/


/*


app.listen(3000);
*/

/*
// app.js
const Koa = require('koa');

// Create Koa app
const app = new Koa();

// Serve requests, here, printing out a simple greeting
app.use(async ctx => {
    ctx.body = 'Hello World';
});

// Start the server
app.listen(3000);
*/

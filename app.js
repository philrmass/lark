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
var koa = require('koa');
var router = require('koa-router');
var app = koa();

var _ = router();              //Instantiate the router
_.get('/hello', getMessage);   // Define routes

function *getMessage() {
   this.body = "Hello world!";
};

app.use(_.routes());           //Use the routes defined using the router
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

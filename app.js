const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const logger = require('koa-morgan');
const jwtMiddleware = require('koa-jwt');
const errorDB = require('koa-json-error');

const koaSwagger = require('koa2-swagger-ui');
const cors = require('koa2-cors');
const serve = require('koa-static');
const config = require('./config/config');

const redisModule = require('./config/redis');
const cron = require('./config/cron');

cron();

redisModule.resetData().then(() => {
  redisModule.fillDB().then();
});

// redisInitial.initial();
// redisInitial.client.hgetall("words", function (err, replies) {
//      console.log(replies['test 1']);
// });

const usersRoutes = require('./api/users');
const videoRoutes = require('./api/video');
const adminRoutes = require('./api/admin');

const app = new Koa();
const router = new Router();

app.use(
  cors({
    origin: '*',
  }),
);

app.use(serve('./public'));

const swaggerOptions = {};
if (config.general.nodeEnv === 'development') {
  swaggerOptions.url = `http://${config.host}:${config.port}/openapi.yaml`;
} else {
  swaggerOptions.url = `https://${config.host}/openapi.yaml`;
}

app.use(
  koaSwagger({
    routePrefix: '/swagger', // host at /swagger instead of default /docs
    swaggerOptions,
  }),
);

app.use(bodyParser());
app.use(logger('tiny'));
app.use(
  errorDB({
    // preFormat: (err) => {
    //   return err.status = 400;
    // }
    format: err => ({
      errors: err.message,
    }),
  }),
);

app.use(
  jwtMiddleware({
    secret: config.general.jwtSecret,
    cookie: 'token_access',
  }).unless({
    path: [
      '/api/users/create',
      '/api/users/auth',
      '/api/video/getInfo',
      '/api/video/subtitlesToHash',
      '/api/video/saveInfo',
    ],
  }),
);

app.use(usersRoutes());
app.use(videoRoutes());
app.use(adminRoutes());
app.use(router.routes());

// const server = https.createServer({
//   key: fs.readFileSync('./config/http_keys/privatekey.pem'),
//   cert: fs.readFileSync('./config/http_keys/certificate.pem'),
//   requestCert: false,
//   rejectUnauthorized: false,
// }, app.callback()).listen(process.env.PORT);
// module.exports = server;

// app.listen(process.env.PORT);

module.exports = app.listen(config.port);

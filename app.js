require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const logger = require('koa-morgan');
const jwtMiddleware = require('koa-jwt');
const errorDB = require('koa-json-error');

const koaSwagger = require('koa2-swagger-ui');
//const cors = require('koa2-cors');
const serve = require('koa-static');

//const fs = require('fs');
//const https = require('https');

const usersRoutes = require('./api/users');

const prefixPath = '/api';

const app = new Koa();
const router = new Router();

app.use(serve('./public'));

// app.use(cors({
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//   maxAge: 5,
//   credentials: true,
//   //allowMethods: ['GET', 'POST', 'DELETE'],
//   allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
// }));

const swaggerOptions = {};
if (process.env.NODE_ENV=='development') {
  swaggerOptions.url = `http://${process.env.HOST}:${process.env.PORT}/openapi.yaml`;
} else {
  swaggerOptions.url = `https://${process.env.HOST}/openapi.yaml`;
}

app.use(
  koaSwagger({
    routePrefix: '/swagger', // host at /swagger instead of default /docs
    swaggerOptions: swaggerOptions,
  }),
);

app.use(bodyParser());
app.use(logger('tiny'));
app.use(errorDB({
  // preFormat: (err) => {
  //   return err.status = 400;
  // }
  format: err => ({
    errors: err.message,
  }),
}));

app.use(jwtMiddleware({
  secret: process.env.JWT_SECRET,
  cookie: 'token_access',
}).unless({
  path: ['/api/users/truncate',
    '/api/users/create',
    '/api/users/auth'
  ],
}));

app.use(usersRoutes());
app.use(router.routes());

// const server = https.createServer({
//   key: fs.readFileSync('./config/http_keys/privatekey.pem'),
//   cert: fs.readFileSync('./config/http_keys/certificate.pem'),
//   requestCert: false,
//   rejectUnauthorized: false,
// }, app.callback()).listen(process.env.PORT);
// module.exports = server;

app.listen(process.env.PORT);

module.exports = app;
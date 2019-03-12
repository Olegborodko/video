require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const logger = require('koa-morgan');
const jwtMiddleware = require('koa-jwt');

const fs = require('fs');
const https = require('https');

//const cookiesMiddleware = require('universal-cookie-koa');
//const cookiesMiddleware = require('koa-cookie');
//const cookiesMiddleware = require('cookie-parser');
const usersRoutes = require('./api/users');

const prefixPath = '/api';

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(logger('tiny'));

app.use(jwtMiddleware({ secret: process.env.JWT_SECRET,
 cookie: 'token_access'
}).unless({ path: ['/api/users/truncate','/api/users/create','/api/users/auth']}));

app.use(usersRoutes());
app.use(router.routes());

const server = https.createServer({
    key: fs.readFileSync('./config/http_keys/privatekey.pem'),
    cert: fs.readFileSync('./config/http_keys/certificate.pem'),
    requestCert: false,
    rejectUnauthorized: false,
}, app.callback()).listen(process.env.PORT);

module.exports = server;

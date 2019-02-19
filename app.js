require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const logger = require('koa-morgan');

const fs = require('fs');
const https = require('https');

const cookiesMiddleware = require('universal-cookie-koa');
const usersRoutes = require('./api/users');

const prefixPath = '/api';

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cookiesMiddleware());
app.use(logger('tiny'));

app.use(usersRoutes());
app.use(router.routes());

const server = https.createServer({
    key: fs.readFileSync('./config/http_keys/privatekey.pem'),
    cert: fs.readFileSync('./config/http_keys/certificate.pem'),
    requestCert: false,
    rejectUnauthorized: false,
}, app.callback()).listen(process.env.PORT);

module.exports = server;

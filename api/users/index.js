const combineRouters = require('koa-combine-routers');

const createUser = require('./create');
const userLogin = require('./login');
const userLogout = require('./logout');
const userRefresh = require('./refresh');

const router = combineRouters(createUser, userLogin, userLogout, userRefresh);

module.exports = router;

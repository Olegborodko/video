const Router = require('koa-router');
const combineRouters = require('koa-combine-routers');

const createUser = require('./create');
const allUsers = require('./all');

const router = combineRouters(
    createUser,
    allUsers,
);

module.exports = router;

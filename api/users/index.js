const Router = require('koa-router');
const combineRouters = require('koa-combine-routers');

const createUser = require('./create');
const allUsers = require('./all');
const truncateUsers = require('./truncate');

const router = combineRouters(
    createUser,
    allUsers,
    truncateUsers
);

module.exports = router;

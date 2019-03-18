const Router = require('koa-router');
const combineRouters = require('koa-combine-routers');

const createUser = require('./create');
const allUsers = require('./all');
const truncateUsers = require('./truncate');
const userById = require('./user');
const userLogin = require('./login');
const userLogout = require('./logout');
const userRefresh = require('./refresh');

const router = combineRouters(
  createUser,
  allUsers,
  truncateUsers,
  userById,
  userLogin,
  userLogout,
  userRefresh,
);

module.exports = router;

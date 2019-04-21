const combineRouters = require('koa-combine-routers');

const wordsToDb = require('./wordsToDb');

const router = combineRouters(wordsToDb);

module.exports = router;

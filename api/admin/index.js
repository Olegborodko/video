const combineRouters = require('koa-combine-routers');

const getSubtitles = require('./getSubtitles');

const router = combineRouters(getSubtitles);

module.exports = router;

const combineRouters = require('koa-combine-routers');

const getSubtitles = require('./getSubtitles');
const getWords = require('./getWords');

const router = combineRouters(getSubtitles, getWords);

module.exports = router;

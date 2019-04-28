const combineRouters = require('koa-combine-routers');

const getSubtitles = require('./getSubtitles');
const getWords = require('./getWords');
const deleteWords = require('./deleteWords');

const router = combineRouters(getSubtitles, getWords, deleteWords);

module.exports = router;

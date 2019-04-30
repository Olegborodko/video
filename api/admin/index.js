const combineRouters = require('koa-combine-routers');

const getSubtitles = require('./getSubtitles');
const getWords = require('./getWords');
const deleteWords = require('./deleteWords');
const changeWord = require('./changeWord');

const router = combineRouters(getSubtitles, getWords, deleteWords, changeWord);

module.exports = router;

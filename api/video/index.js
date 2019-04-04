const combineRouters = require('koa-combine-routers');

const getSubtitres = require('./getSubtitres');
const getInfo = require('./getInfo');
const subtitlesToHash = require('./subtitlesToHash');
// const save = require('./save');
// const remove = require('./remove');

const router = combineRouters(
  getSubtitres,
  getInfo,
  subtitlesToHash
  // save,
  // remove
);

module.exports = router;

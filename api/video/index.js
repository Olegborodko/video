const combineRouters = require('koa-combine-routers');

const getInfo = require('./getInfo');
const subtitlesToHash = require('./subtitlesToHash');
// const save = require('./save');
// const remove = require('./remove');

const router = combineRouters(
  getInfo,
  subtitlesToHash,
  // save,
  // remove
);

module.exports = router;

const combineRouters = require('koa-combine-routers');

const getInfo = require('./getInfo');
const subtitlesToHash = require('./subtitlesToHash');
const saveInfo = require('./saveInfo');
// const remove = require('./remove');

const router = combineRouters(
  getInfo,
  subtitlesToHash,
  saveInfo,
  // remove
);

module.exports = router;

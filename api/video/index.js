const combineRouters = require('koa-combine-routers');

const getSubtitres = require('./getSubtitres');

const router = combineRouters(
  getSubtitres,
);

module.exports = router;

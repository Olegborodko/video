const combineRouters = require('koa-combine-routers');

const getInfo = require('./getInfo');
const subtitlesToHash = require('./subtitlesToHash');
const saveInfo = require('./saveInfo');
const addToFavorites = require('./addToFavorites');

const router = combineRouters(
  getInfo,
  subtitlesToHash,
  saveInfo,
  addToFavorites,
);

module.exports = router;

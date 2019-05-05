const combineRouters = require('koa-combine-routers');

const getInfo = require('./getInfo');
const subtitlesToHash = require('./subtitlesToHash');
const saveInfo = require('./saveInfo');
const addToFavorites = require('./addToFavorites');
const removeFromFavorites = require('./removeFromFavorites');

const router = combineRouters(
  getInfo,
  subtitlesToHash,
  saveInfo,
  addToFavorites,
  removeFromFavorites,
);

module.exports = router;

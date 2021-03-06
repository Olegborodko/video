const Router = require('koa-router');

const router = new Router();
const knex = require('../../config/knex');

const subtitlesSchema = require('../joiHelpers/schemes/subtitles');
const runValidation = require('../joiHelpers/runValidation');

const translateApi = require('./helpers/translateApi');
const redisModule = require('../../config/redis');

router.post('/api/video/subtitlesToHash', async (ctx) => {
  const { subtitles } = ctx.request.body;

  const errors = runValidation(ctx.request.body, subtitlesSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 400;
    return;
  }

  function wordCheck(item) {
    const step1 = item.match(/([a-z].*[a-z])|[a-z]/g);

    if (step1) {
      const step2 = step1[0].match(
        /(^[a-z]+(-)[a-z]+$)|(^[a-z]+(&#39;)[a-z]+$)|(^[a-z]+[a-z]$)|(^[a-z]$)/g,
      );
      if (step2) {
        return step2[0].replace(/&#39;/g, "'");
      }
    }
    return false;
  }

  const wordsObject = {};
  const allWordsFromDb = [];

  const wordsInDictionary = await redisModule.getAsync('words').then((res) => {
    if (res) {
      return res;
    }
    return false;
  });

  async function wordsFromDbOrTanslate(token, correctWord) {
    if (Object.prototype.hasOwnProperty.call(wordsInDictionary, correctWord)) {
      wordsObject[correctWord] = wordsInDictionary[correctWord];

      knex('dictionary')
        .increment('counter')
        .where('en', correctWord)
        .then();

      return true;
    }
    return translateApi.translateAndSave(token, correctWord).then((res) => {
      wordsObject[correctWord] = res;
      return true;
    });
  }

  const token = await translateApi.getCorrectToken();

  subtitles.text.forEach((value) => {
    const value1 = value.$t.toLowerCase();
    const arrayWords = value1.split(/[\s,]+/);

    arrayWords.forEach((item) => {
      const correctWord = wordCheck(item);
      if (correctWord && !wordsObject[correctWord]) {
        wordsObject[correctWord] = true;
        if (token) {
          allWordsFromDb.push(wordsFromDbOrTanslate(token, correctWord));
        }
      }
    });
  });

  await Promise.all(allWordsFromDb);

  ctx.response.body = {
    words: wordsObject,
  };

  ctx.response.status = 200;
});

module.exports = router;

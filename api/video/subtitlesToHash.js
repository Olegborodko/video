require('dotenv').config();
const Router = require('koa-router');

const router = new Router();
const knex = require('../../config/knex');

const subtitlesSchema = require('../joiHelpers/schemes/subtitles');
const runValidation = require('../joiHelpers/runValidation');

const translateApi = require('./helpers/translateApi');

router.post('/api/video/subtitlesToHash', async ctx => {
  const { subtitles } = ctx.request.body;

  const errors = runValidation(ctx.request.body, subtitlesSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 404;
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

  async function wordsFromDbOrTanslate(token, correctWord) {
    return knex('dictionary')
      .where('en', correctWord)
      .then(data => {
        if (data.length > 0) {
          wordsObject[correctWord] = data[0].ru;
        } else {
          // translate word throught api
          const translateResult = translateApi
            .translateAndSave(token, correctWord)
            .then(data => {
              if (data) {
                wordsObject[correctWord] = data;
              } else {
                wordsObject[correctWord] = false;
              }
            });
        }
      });
  }

  const token = await translateApi.getCorrectToken();
  // const test = await wordsFromDbOrTanslate(token, "a");
  // console.log(wordsObject);
  // return;

  subtitles.forEach(value => {
    const value1 = value.text.toLowerCase();
    const arrayWords = value1.split(/[\s,]+/);

    arrayWords.forEach(item => {
      const correctWord = wordCheck(item);
      if (correctWord && !wordsObject[correctWord]) {
        wordsObject[correctWord] = true;
        allWordsFromDb.push(wordsFromDbOrTanslate(token, correctWord));
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

const Router = require('koa-router');

const router = new Router();
const requestPromise = require('request-promise');
const knex = require('../../config/knex');

const subtitlesSchema = require('../joiHelpers/schemes/subtitles');
const runValidation = require('../joiHelpers/runValidation');

router.post('/api/video/subtitlesToHash', async (ctx) => {
  const { subtitles } = ctx.request.body;

  const errors = runValidation(ctx.request.body, subtitlesSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 404;
    return;
  }

  let wordsObject = {};

  function wordCheck(item) {
    const step1 = item.match(/([a-z].*[a-z])|[a-z]/g);

    if (step1) {
      const step2 = step1[0].match(/(^[a-z]+\-[a-z]+$)|(^[a-z]+(&#39;)[a-z]+$)|(^[a-z]+[a-z]$)|(^[a-z]$)/g);
      if (step2) {
        return step2[0];
      }
    }
    return false; 
  }

  for (let value of subtitles) {
    let value1 = value.text.toLowerCase();
    let arrayWords = value1.split(/[\s,]+/);

    for (let item of arrayWords) {
      const correctWord = wordCheck(item);
      if (correctWord && !wordsObject[correctWord]){     
            wordsObject[correctWord] = true;
            await knex('dictionary').where('en', correctWord).then((data) => {
              if (data.length > 0) {
                //console.log(`${data[0].en} -- ${data[0].ru}`);
                wordsObject[correctWord] = data[0].ru;
              } else {

              }
            });  
      }

    }
  };

  ctx.response.body = {
    words: wordsObject
  };
  
  ctx.response.status = 200;
});

module.exports = router;
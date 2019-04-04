const Router = require('koa-router');

const router = new Router();
const requestPromise = require('request-promise');

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
  subtitles.forEach(function(item, i, arr) {
    let text = item.text.toLowerCase();
    text = text.replace(/&#39;/g, "\'");
    text = text.replace(/[,\.]/g, "");
    text = text.replace(/\n/g, " ");
    //console.log(text);
    let arrayWords = text.split(" ");

    arrayWords.forEach(function(item) {
      wordsObject[item] = false;
    });
  });

    

  //     ctx.response.body = {
  //       id: dataObject.items[0].id,
  //       title: dataObject.items[0].snippet.title,
  //       description: dataObject.items[0].snippet.description,
  //       thumbnails: dataObject.items[0].snippet.thumbnails.medium.url
  //     };
  //     ctx.response.status = 200;
 
  // ctx.response.body = { errors: 'Can not get video information' };
  // ctx.response.status = 400;
});

module.exports = router;

const Router = require('koa-router');

const router = new Router();
const requestPromise = require('request-promise');
const getVideoId = require('get-video-id');

const videoLinkSchema = require('../joiHelpers/schemes/videoLink');
const runValidation = require('../joiHelpers/runValidation');

router.post('/api/video/getInfo', async (ctx) => {
  const { link } = ctx.request.body;

  const errors = runValidation(ctx.request.body, videoLinkSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 404;
    return;
  }

  const { id } = getVideoId(link);

  if (id) {
    const videoData = await requestPromise(
      `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=snippet&key=${
        process.env.YOUTUBE_KEY
      }`,
    )
      .then(data => data)
      .catch(() => false);

    const dataObject = JSON.parse(videoData);

    if (
      Object.prototype.hasOwnProperty.call(dataObject, 'items')
      && dataObject.items.length > 0
      && Object.prototype.hasOwnProperty.call(dataObject.items[0], 'id')
    ) {
      ctx.response.body = {
        id: dataObject.items[0].id,
        title: dataObject.items[0].snippet.title,
        description: dataObject.items[0].snippet.description,
        thumbnails: dataObject.items[0].snippet.thumbnails.medium.url,
      };
      ctx.response.status = 200;
      return;
    }
  }

  ctx.response.body = { errors: 'Can not get video information' };
  ctx.response.status = 400;
});

module.exports = router;

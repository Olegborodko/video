const Router = require('koa-router');

const router = new Router();
const requestPromise = require('request-promise');
const getVideoId = require('get-video-id');
const parser = require('xml2json');
const videoLinkSchema = require('../joiHelpers/schemes/videoLink');
const runValidation = require('../joiHelpers/runValidation');

router.post('/api/video/getSubtitres', async (ctx) => {
  const { link } = ctx.request.body;

  const errors = runValidation(ctx.request.body, videoLinkSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 403;
    return;
  }

  ctx.response.body = { errors: 'Can not find video in youtube' };

  const { id } = getVideoId(link);
  if (id) {
    const requestXML = await requestPromise(
      `http://video.google.com/timedtext?lang=en&v=${id}`,
    )
      .then(data => data)
      .catch(() => false);

    if (requestXML) {
      const json = parser.toJson(requestXML);
      const subtitles = JSON.parse(json).transcript;

      ctx.response.body = { subtitles };
      ctx.response.status = 200;
      return;
    }
  } else {
    ctx.response.body = { errors: 'English subtitres is not found' };
  }

  ctx.response.status = 400;
});

module.exports = router;

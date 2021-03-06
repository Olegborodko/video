const Router = require('koa-router');

const router = new Router();
const requestPromise = require('request-promise');
const getVideoId = require('get-video-id');
const parser = require('xml2json');
const videoLinkSchema = require('../joiHelpers/schemes/videoLink');
const runValidation = require('../joiHelpers/runValidation');
const currentUserIsAdmin = require('./helpers/ifAdmin');

router.post('/api/admin/getSubtitles', async (ctx) => {
  if (!(await currentUserIsAdmin(ctx.cookies.get('token_access')))) {
    ctx.response.body = { errors: 'Access not allowed' };
    ctx.response.status = 401;
    return;
  }

  const { link } = ctx.request.body;

  const errors = runValidation(ctx.request.body, videoLinkSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 400;
    return;
  }

  const { id } = getVideoId(link);
  if (id) {
    const requestXML = await requestPromise(
      `http://video.google.com/timedtext?lang=en&v=${id}`,
    ).catch(() => false);

    if (requestXML) {
      const json = parser.toJson(requestXML);
      const subtitles = JSON.parse(json).transcript;

      ctx.response.body = { subtitles };
      ctx.response.status = 200;
      return;
    }
  }

  ctx.response.body = { errors: 'Cannot find english subtitles' };
  ctx.response.status = 400;
});

module.exports = router;

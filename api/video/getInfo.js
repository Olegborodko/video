const Router = require('koa-router');

const router = new Router();
const requestPromise = require('request-promise');
const getVideoId = require('get-video-id');

const videoLinkSchema = require('../joiHelpers/schemes/videoLink');
const runValidation = require('../joiHelpers/runValidation');

function qsToJson(qs) {
  const result = {};
  const pars = qs.split('&');

  for (let i = 0; i < pars.length - 1; i += 1) {
    const part = pars[i].split('=');
    result[part[0]] = decodeURIComponent(part[1]);
  }
  return result;
}

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
    const videoDate = await requestPromise(`http://youtube.com/get_video_info?html5=1&video_id=${id}`)
      .then(data => qsToJson(data))
      .catch(() => false);

    if (videoDate.title && videoDate.author && videoDate.length_seconds) {
      ctx.response.body = {
        title: videoDate.title,
        author: videoDate.author,
        length: videoDate.length_seconds,
      };
      ctx.response.status = 200;
      return;
    }
  }

  ctx.response.body = { errors: 'Can not get video information' };
  ctx.response.status = 400;
});

module.exports = router;

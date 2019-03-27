const Router = require('koa-router');

const router = new Router();

const videoLinkSchema = require('../joiHelpers/schemes/videoLink');
const runValidation = require('../joiHelpers/runValidation');

router.post('/api/video/save', async (ctx) => {
  // const { link, title } = ctx.request.body;

  const errors = runValidation(ctx.request.body, videoLinkSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 400;
  }
});

module.exports = router;

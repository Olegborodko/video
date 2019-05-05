const Router = require('koa-router');

const router = new Router();
const knex = require('../../config/knex');
const currentUserId = require('../users/helpers/idByToken');

const schema = require('../joiHelpers/schemes/video/removeFromFavorites');
const runValidation = require('../joiHelpers/runValidation');

router.post('/api/video/removeFromFavorites', async (ctx) => {
  const userIdFromToken = currentUserId(ctx.cookies.get('token_access'));

  if (!userIdFromToken) {
    ctx.response.body = { errors: 'Access not allowed' };
    ctx.response.status = 401;
    return;
  }

  const errors = runValidation(ctx.request.body, schema);
  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 400;
    return;
  }

  const dataRequest = ctx.request.body;

  async function ifExistRemove(userId, videoId) {
    const result = await knex('users_video')
      .where('user_id', userId)
      .where('video_id', videoId)
      .del();

    if (!result) {
      return false;
    }
    return true;
  }

  const result = await ifExistRemove(userIdFromToken, dataRequest.video_id);

  if (!result) {
    ctx.response.body = { errors: 'Can not remove video from favorites' };
    ctx.response.status = 400;
    return;
  }

  ctx.response.body = { success: result };
  ctx.response.status = 200;
});

module.exports = router;

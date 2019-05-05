const Router = require('koa-router');

const router = new Router();
const knex = require('../../config/knex');
const config = require('../../config/config');
const currentUserId = require('../users/helpers/idByToken');

const schema = require('../joiHelpers/schemes/video/addToFavorites');
const runValidation = require('../joiHelpers/runValidation');

router.post('/api/video/addToFavorites', async (ctx) => {
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

  async function insertVideo(userId, videoId) {
    const ifExistRecord = await knex('users_video')
      .where('user_id', userId)
      .where('video_id', videoId);

    if (ifExistRecord.length > 0) {
      return false;
    }

    const insertResult = await knex('users_video')
      .insert({
        user_id: userId,
        video_id: videoId,
      })
      .then(() => true)
      .catch((error) => {
        if (error.code === config.errors.db.noSuchRelation) {
          return false;
        }
        throw error;
      });

    return insertResult;
  }

  const result = await insertVideo(userIdFromToken, dataRequest.video_id);

  if (!result) {
    ctx.response.body = { errors: 'Can not add video to favorites' };
    ctx.response.status = 400;
    return;
  }

  ctx.response.body = { success: result };
  ctx.response.status = 200;
});

module.exports = router;

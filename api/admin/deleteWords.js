const Router = require('koa-router');

const router = new Router();

const knex = require('../../config/knex');

const deleteWordsSchema = require('../joiHelpers/schemes/admin/deleteWords');
const runValidation = require('../joiHelpers/runValidation');
const currentUserIsAdmin = require('./helpers/ifAdmin');

const redisModule = require('../../config/redis');

router.post('/api/admin/deleteWords', async (ctx) => {
  if (!(await currentUserIsAdmin(ctx.cookies.get('token_access')))) {
    ctx.response.body = { errors: 'Access not allowed' };
    ctx.response.status = 401;
    return;
  }

  const errors = runValidation(ctx.request.body, deleteWordsSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 400;
    return;
  }

  const data = ctx.request.body;
  let resultRequest = knex('dictionary')
    .returning('id')
    .where('protect', false);

  if (Object.prototype.hasOwnProperty.call(data, 'counter')) {
    resultRequest = resultRequest.where('counter', data.counter);
  }

  if (Object.prototype.hasOwnProperty.call(data, 'withoutTranslation')) {
    if (data.withoutTranslation) {
      resultRequest = resultRequest.where('ru', '');
    }
  }

  if (Object.prototype.hasOwnProperty.call(data, 'ids')) {
    if (data.ids.length > 0) {
      resultRequest = resultRequest.whereIn('id', data.ids);
    }
  }

  const success = await resultRequest.del();

  if (success.length === 0) {
    ctx.response.body = { errors: 'Nothing found' };
    ctx.response.status = 400;
    return;
  }

  await redisModule.resetData();
  await redisModule.fillDB();

  ctx.response.body = { success };
  ctx.response.status = 200;
});

module.exports = router;

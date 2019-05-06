const Router = require('koa-router');

const router = new Router();

const knex = require('../../config/knex');
const config = require('../../config/config');

const changeWordSchema = require('../joiHelpers/schemes/admin/changeWord.js');
const runValidation = require('../joiHelpers/runValidation');
const currentUserIsAdmin = require('./helpers/ifAdmin');

router.post('/api/admin/changeWord', async (ctx) => {
  if (!(await currentUserIsAdmin(ctx.cookies.get('token_access')))) {
    ctx.response.body = { errors: 'Access not allowed' };
    ctx.response.status = 401;
    return;
  }

  const errors = runValidation(ctx.request.body, changeWordSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 400;
    return;
  }

  const data = ctx.request.body;
  // const resultObject = JSON.parse(JSON.stringify(data));

  const success = await knex('dictionary')
    .returning('id')
    .where('id', data.id)
    .update(data)
    .catch((error) => {
      if (error.code === config.errors.db.alreadyExist) {
        return false;
      }
      throw error;
    });

  if (!success) {
    ctx.response.body = { errors: 'Error - duplicate key' };
    ctx.response.status = 400;
    return;
  }

  if (success.length === 0) {
    ctx.response.body = { errors: 'Nothing found' };
    ctx.response.status = 400;
    return;
  }

  ctx.response.body = { success };
  ctx.response.status = 200;
});

module.exports = router;

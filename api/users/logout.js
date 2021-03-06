const Router = require('koa-router');

const router = new Router();
const knex = require('../../config/knex');
const currentUserId = require('./helpers/idByToken.js');

router.post('/api/users/logout', async (ctx) => {
  const userId = currentUserId(ctx.cookies.get('token_access'));

  if (userId) {
    await knex('users')
      .where('id', userId)
      .update({
        token: '',
      });

    ctx.cookies.set('token_access', '');
    ctx.response.body = { success: 'logout' };
    ctx.response.status = 200;
    return;
  }

  ctx.response.body = { errors: 'invalid access' };
  ctx.response.status = 401;
});

module.exports = router;

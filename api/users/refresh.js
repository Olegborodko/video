const uuidv4 = require('uuid/v4');
const Router = require('koa-router');
const config = require('../../config/config');
const knex = require('../../config/knex');

const { jwtEncode } = require('../../config/jwtHelpers/jwt');
const currentUserId = require('./helpers/idByToken.js');

const router = new Router();

router.post('/api/users/refresh', async (ctx) => {
  const { tokenRefresh } = ctx.request.body;

  const userId = currentUserId(ctx.cookies.get('token_access'));

  if (userId) {
    const tokenAccess = jwtEncode(userId, config.general.tokenAccessTime);
    const newTokenRefresh = jwtEncode(
      uuidv4(),
      config.general.tokenRefreshTime,
    );

    const userIdPromice = knex('users').where('id', userId);

    const user = await userIdPromice;

    if (user[0].token === tokenRefresh) {
      userIdPromice.update({
        token: newTokenRefresh,
      });

      ctx.cookies.set('token_access', tokenAccess);

      ctx.response.body = {
        status: 'success',
        token_refresh: newTokenRefresh,
      };
      ctx.response.status = 200;
      return;
    }
  }

  ctx.response.body = { errors: 'invalid access' };
  ctx.response.status = 401;
});

module.exports = router;

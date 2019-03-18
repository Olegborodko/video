const Router = require('koa-router');
const knex = require('../../config/knex');

const router = new Router();
const { jwtDecode, jwtEncode } = require('../../config/jwtHelpers/jwt');
const uuidv4 = require('uuid/v4');
const currentUserId = require('./helpers/idByToken.js');

router.post('/api/users/refresh', async (ctx, next) => {
  const { tokenRefresh } = ctx.request.body;

  const userId = currentUserId(ctx.cookies.get('token_access'));

  if (userId) {
    const token_access = jwtEncode(userId, '30m');
    const token_refresh = jwtEncode(uuidv4(), '30d');

    const userIdPromice = knex('users').where('id', userId);

    const user = await userIdPromice.then(data => data);

    if (user[0].token === tokenRefresh) {
      userIdPromice.update({
        token: token_refresh,
      });

      ctx.cookies.set('token_access', token_access);

      ctx.response.body = {
        status: 'success',
        token_refresh,
      };
      ctx.response.status = 200;
      return;
    }
  }

  ctx.response.body = { errors: 'invalid access' };
  ctx.response.status = 404;
});

module.exports = router;

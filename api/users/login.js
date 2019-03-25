const Router = require('koa-router');
const uuidv4 = require('uuid/v4');

const router = new Router();
const knex = require('../../config/knex');

const runValidation = require('../joiHelpers/runValidation');
const schemaUserLogin = require('../joiHelpers/schemes/userLogin');
const { bcryptComparePromice } = require('../../config/bcrypt');
const { jwtEncode } = require('../../config/jwtHelpers/jwt');

router.post('/api/users/auth', async (ctx) => {
  const { password, email } = ctx.request.body;

  const errors = runValidation(ctx.request.body, schemaUserLogin);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 404;
    return;
  }

  const dataPromice = knex('users').where('email', email);

  const data = await dataPromice.then((result) => {
    if (result.length) {
      return result;
    }
    return false;
  });

  if (data) {
    const passwordTrue = await bcryptComparePromice(password, data[0].password).then(
      result => result,
    );

    if (passwordTrue) {
      const tokenAccess = jwtEncode(data[0].id, '30m');
      const tokenRefresh = jwtEncode(uuidv4(), '30d');

      await dataPromice.update({
        token: tokenRefresh,
      });

      ctx.cookies.set('token_access', tokenAccess);
      ctx.response.body = {
        success: 'success',
        token_refresh: tokenRefresh,
      };
      ctx.response.status = 200;
      return;
    }
  }

  ctx.response.body = { errors: 'password or email are not correct' };
  ctx.response.status = 400;
});

module.exports = router;

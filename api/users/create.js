const Router = require('koa-router');
const uuidv4 = require('uuid/v4');

const router = new Router();
const knex = require('../../config/knex');
const dbFormatError = require('../../db/errorHelper/formatError');
const { jwtEncode } = require('../../config/jwtHelpers/jwt');
const { bcryptHashPromice, saltRounds } = require('../../config/bcrypt');

const runValidation = require('../joiHelpers/runValidation');
const userSchema = require('../joiHelpers/schemes/userCreate');

router.post('/api/users/create', async (ctx) => {
  const { password, email, name } = ctx.request.body;

  const errors = runValidation(ctx.request.body, userSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 400;
    return;
  }

  const passwordProtect = await bcryptHashPromice(password, saltRounds).then(data => data);

  const tokenRefresh = jwtEncode(uuidv4(), '0');

  await knex('users').returning('id').insert({
    name,
    email,
    password: passwordProtect,
    token: tokenRefresh,
  })
    .then((data) => {
      const id = data[0];
      const tokenAccess = jwtEncode(id, '30m'); // '30m' , '1ms'

      ctx.cookies.set('token_access', tokenAccess);

      ctx.response.body = {
        success: 'success',
        token_refresh: tokenRefresh,
      };
      ctx.response.status = 202;
    })
    .catch((error) => {
      ctx.response.body = { errors: dbFormatError(error) };
      ctx.response.status = 400;
    });
});

module.exports = router;

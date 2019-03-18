const Router = require('koa-router');

const router = new Router();
const Joi = require('joi');
const knex = require('../../config/knex');
const dbFormatError = require('../../db/errorHelper/formatError');
const { jwtEncode } = require('../../config/jwtHelpers/jwt');
const uuidv4 = require('uuid/v4');
const { bcryptHashPromice, saltRounds } = require('../../config/bcrypt');

const runValidation = require('../joiHelpers/runValidation');
const userSchema = require('../joiHelpers/schemes/userCreate');

router.post('/api/users/create', async (ctx, next) => {
  const { password, email, login } = ctx.request.body;

  const errors = runValidation(ctx.request.body, userSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 400;
    return;
  }

  const passwordProtect = await bcryptHashPromice(password, saltRounds).then(data => data);

  const token_refresh = jwtEncode(uuidv4(), '0');

  await knex('users').returning('id').insert({
    login,
    email,
    password: passwordProtect,
    token: token_refresh,
  })
    .then((data) => {
      const id = data[0];
      const token_access = jwtEncode(id, '30m'); // '30m' , '1ms'

      ctx.cookies.set('token_access', token_access);

      ctx.response.body = {
        success: 'success',
        token_refresh,
      };
      ctx.response.status = 202;
    })
    .catch((error) => {
      ctx.response.body = { errors: dbFormatError(error) };
      ctx.response.status = 400;
    });
});

module.exports = router;

const Router = require('koa-router');

const router = new Router();
const Joi = require('joi');
const knex = require('../../config/knex');
const dbFormatError = require('../../db/errorHelper/formatError');
const { jwtEncode } = require('../../config/jwtHelpers/jwt');
const uuidv4 = require('uuid/v4');

const runValidation = require('../joiHelpers/runValidation');
const userSchema = require('../joiHelpers/schemes/user');

router.post('/api/users', async (ctx, next) => {
    const { password } = ctx.request.body;
    const { email } = ctx.request.body;
    const { login } = ctx.request.body;

    const errors = runValidation(ctx.request.body, userSchema);

    if (errors) {
        ctx.response.body = { errors };
        ctx.response.status = 400;
        ctx.cookies.set('token_access', '');
        return;
    }

    await knex('users').returning('id').insert({
        login,
        email,
        password,
    })
        .then((data) => {
            const id = data[0];
            const token_access = jwtEncode(id, 30); //30m
            const token_refresh = jwtEncode(uuidv4(), '30d');
            //ctx.request.universalCookies.set('jwt', token_access);
            ctx.cookies.set('token_access', token_access);

            ctx.response.body = {
                success: 'success',
                token_refresh: token_refresh
            };
            ctx.response.status = 202;
        })
        .catch((error) => {
            ctx.cookies.set('token_access', '');
            ctx.response.body = { errors: dbFormatError(error) };
            ctx.response.status = 400;
        });
});

module.exports = router;

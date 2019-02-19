const Router = require('koa-router');
const router = new Router();
const Joi = require('joi');
const knex = require('../../config/knex');
const dbFormatError = require('../../db/errorHelper/formatError');
const { jwtEncode } = require('../../config/jwtHelpers/jwt');

const runValidation = require('../joiHelpers/runValidation');
const userSchema = require('../joiHelpers/schemes/user');

router.post('/api/users', async (ctx, next) => {
    const password = ctx.request.body['password'];
    const email = ctx.request.body['email'];
    const login = ctx.request.body['login'];

    const errors = runValidation(ctx.request.body, userSchema);

    if (errors) {
        ctx.response.body = { errors: errors }
        ctx.response.status = 400;
        return;
    }

    await knex('users').returning('id').insert({
        login: login,
        email: email,
        password: password
    })
    .then((data)=>{
        const id = data[0];
        const jwt = jwtEncode(id);
        ctx.body = { success: jwt };
        ctx.status = 202;
    })
    .catch((error)=>{
        ctx.response.body = { errors: dbFormatError(error) };
        ctx.response.status = 400;
    });

});

module.exports = router;
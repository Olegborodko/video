const Router = require('koa-router');

const router = new Router();
const Joi = require('joi');
const knex = require('../../config/knex');
const dbFormatError = require('../../db/errorHelper/formatError');

const runValidation = require('../joiHelpers/runValidation');
const schemaUserLogin = require('../joiHelpers/schemes/userLogin');
const { bcryptComparePromice } = require('../../config/bcrypt');
const { jwtEncode } = require('../../config/jwtHelpers/jwt');
const uuidv4 = require('uuid/v4');

router.post('/api/users/auth', async (ctx, next) => {
    const { password, email } = ctx.request.body;

    errors = runValidation(ctx.request.body, schemaUserLogin);

    if (errors) {
    	//ctx.cookies.set('token_access', '');
        ctx.response.body = { errors };
        ctx.response.status = 400;
        return;
    }

    const data = await knex('users').where('email', email).then((data) => {
        if (data.length) {
            return data;
        } else {
            return false;
        }
    });

    if (data) {
        const passwordTrue = await bcryptComparePromice(password, data[0].password).then((data) => {
            return data;
        });

        if (passwordTrue) {
        	const token_access = jwtEncode(data[0].id, 30); //30m
            const token_refresh = jwtEncode(uuidv4(), '30d');

            ctx.cookies.set('token_access', token_access);
            ctx.response.body = {
                success: 'success',
                token_refresh: token_refresh
            };
            ctx.response.status = 200;
            return;
        }
    }

	//ctx.cookies.set('token_access', '');
    ctx.response.body = { "errors": "password or email are not correct" }
    ctx.response.status = 404;

});

module.exports = router;
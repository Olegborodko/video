const knex = require('../../config/knex');

const Router = require('koa-router');
const router = new Router();
const Joi = require('joi');
const userId = require('../joiHelpers/schemes/userId');
const runValidation = require('../joiHelpers/runValidation');

router.get('/api/users/:id', async (ctx, next) => {
    const id = ctx.params.id;

    const errors = runValidation({ "id": id }, userId);

    if (errors) {
        ctx.response.body = { errors };
        ctx.response.status = 400;
        return;
    }

    await knex('users').where('id', id).select('login', 'id').then((data) => {
            if (data.length) {
                ctx.response.body = data;
                ctx.response.status = 200;
            } else {
                ctx.response.status = 404;
            }
        })
        .catch((error) => {
            ctx.response.body = { errors: dbFormatError(error) };
            ctx.response.status = 400;
        });
});

module.exports = router;
const knex = require('../../config/knex');

const Router = require('koa-router');
const router = new Router();

router.post('/api/users/truncate', async (ctx, next) => {

    await knex('users').truncate().then((data) => {
            ctx.response.body = data;
            ctx.response.status = 200;
        })
        .catch((error) => {
            ctx.response.body = { errors: dbFormatError(error) };
            ctx.response.status = 400;
        });
});

module.exports = router;
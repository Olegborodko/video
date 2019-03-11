const knex = require('../../config/knex');

const Router = require('koa-router');
const router = new Router();

router.get('/api/users', async (ctx, next) => {

    await knex.select('login', 'id').from('users').then((data) => {
            ctx.response.body = data;
            ctx.response.status = 200;
        })
        .catch((error) => {
            ctx.response.body = { errors: dbFormatError(error) };
            ctx.response.status = 400;
        });
});

module.exports = router;
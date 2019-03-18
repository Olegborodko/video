const Router = require('koa-router');
const knex = require('../../config/knex');

const router = new Router();

router.get('/api/users', async (ctx, next) => {
  await knex.select('login', 'id').from('users').then((data) => {
    ctx.response.body = data;
    ctx.response.status = 200;
  });
});

module.exports = router;

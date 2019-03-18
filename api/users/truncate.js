const Router = require('koa-router');
const knex = require('../../config/knex');

const router = new Router();

router.post('/api/users/truncate', async (ctx, next) => {
  await knex('users').truncate().then((data) => {
    ctx.response.body = data;
    ctx.response.status = 200;
  });
});

module.exports = router;

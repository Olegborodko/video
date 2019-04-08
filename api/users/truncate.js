const Router = require('koa-router');
const knex = require('../../config/knex');

const router = new Router();

router.post('/api/users/truncate', async (ctx) => {
  await knex.raw('TRUNCATE TABLE users, users_video CASCADE').then((data) => {
    ctx.response.body = data;
    ctx.response.status = 200;
  });
});

module.exports = router;

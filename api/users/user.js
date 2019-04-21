const Router = require('koa-router');

const router = new Router();
const knex = require('../../config/knex');
const userId = require('../joiHelpers/schemes/userId');
const runValidation = require('../joiHelpers/runValidation');

router.get('/api/users/:id', async (ctx) => {
  const { id } = ctx.params;

  const errors = runValidation({ id }, userId);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 404;
    return;
  }

  await knex('users')
    .where('id', id)
    .then((data) => {
      if (data.length) {
        ctx.response.body = data;
        ctx.response.status = 200;
      } else {
        ctx.response.status = 400;
      }
    });
});

module.exports = router;

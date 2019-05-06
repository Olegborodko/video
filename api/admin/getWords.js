const Router = require('koa-router');

const router = new Router();

const knex = require('../../config/knex');

const getWordsSchema = require('../joiHelpers/schemes/admin/getWords');
const runValidation = require('../joiHelpers/runValidation');
const currentUserIsAdmin = require('./helpers/ifAdmin');

const knexPagination = require('../../lib/knexPagination');

knexPagination(knex);

router.post('/api/admin/getWords', async (ctx) => {
  if (!(await currentUserIsAdmin(ctx.cookies.get('token_access')))) {
    ctx.response.body = { errors: 'Access not allowed' };
    ctx.response.status = 401;
    return;
  }

  const errors = runValidation(ctx.request.body, getWordsSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 400;
    return;
  }

  const data = ctx.request.body;
  let resultRequest = knex('dictionary');

  if (Object.prototype.hasOwnProperty.call(data, 'counter')) {
    resultRequest = resultRequest.where('counter', data.counter);
  }

  if (!Object.prototype.hasOwnProperty.call(data, 'page')) {
    data.page = 1;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'withoutTranslation')) {
    if (data.withoutTranslation) {
      resultRequest = resultRequest.where('ru', '');
    }
  }

  const result = await resultRequest.paginate(10, data.page, true);

  const getCounter = await knex('dictionary')
    .min('counter')
    .max('counter');
  if (
    getCounter.length > 0
    && Object.prototype.hasOwnProperty.call(getCounter[0], 'min')
    && Object.prototype.hasOwnProperty.call(getCounter[0], 'max')
  ) {
    result.counterMin = getCounter[0].min;
    result.counterMax = getCounter[0].max;
  }

  ctx.response.body = { result };
  ctx.response.status = 200;
});

module.exports = router;

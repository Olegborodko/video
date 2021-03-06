const Router = require('koa-router');
const knex = require('../../config/knex');

const router = new Router();

const schema = require('../joiHelpers/schemes/video/saveInfo');
const runValidation = require('../joiHelpers/runValidation');

router.post('/api/video/saveInfo', async (ctx) => {
  const requestData = ctx.request.body;

  const errors = runValidation(ctx.request.body, schema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 400;
    return;
  }

  const raw = await knex.raw(
    `
    INSERT INTO video (video_identifier, title, description, thumbnails)
    VALUES (:video_identifier, :title, :description, :thumbnails) 
    ON CONFLICT (video_identifier) 
    DO UPDATE
     SET title = :title, 
     description = :description, 
     thumbnails = :thumbnails 
     RETURNING id;
  `,
    {
      video_identifier: requestData.video_identifier,
      title: requestData.title,
      description: requestData.description,
      thumbnails: requestData.thumbnails,
    },
  );

  if (
    Object.prototype.hasOwnProperty.call(raw, 'rows')
    && raw.rows.length > 0
    && Object.prototype.hasOwnProperty.call(raw.rows[0], 'id')
  ) {
    ctx.response.body = { id: raw.rows[0].id };
    ctx.response.status = 200;
  } else {
    ctx.response.body = { errors: 'db error' };
    ctx.response.status = 400;
  }
});

module.exports = router;

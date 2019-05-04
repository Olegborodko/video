const { onUpdateTrigger } = require('../sqlHelpers/update_at');

exports.up = knex => knex.schema.createTable('video', (table) => {
  table.increments();
  table.string('video_id').notNullable();
  table.string('title').notNullable();
  table.string('description');
  table.string('thumbnails');
  table.timestamps(false, true);

  table.unique('video_id');
}).then(() => knex.raw(onUpdateTrigger('video')));

exports.down = knex => knex.schema.dropTable('video');

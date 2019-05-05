const { onUpdateTrigger } = require('../sqlHelpers/update_at');

exports.up = knex => knex.schema.createTable('video', (table) => {
  table.increments();
  table.string('video_identifier').notNullable();
  table.string('title').notNullable();
  table.string('description');
  table.string('thumbnails');
  table.timestamps(false, true);

  table.unique('video_identifier');
}).then(() => knex.raw(onUpdateTrigger('video')));

exports.down = knex => knex.schema.dropTable('video');

const { onUpdateTrigger } = require('../sqlHelpers/update_at');

exports.up = knex => knex.schema.createTable('video', (table) => {
  table.increments();
  table.string('videoId').notNullable();
  table.string('title').notNullable();
  table.string('description');
  table.string('thumbnails');
  table.json('translate');
  table.timestamps(false, true);

  table.unique('videoId');
}).then(() => knex.raw(onUpdateTrigger('video')));

exports.down = knex => knex.schema.dropTable('video');

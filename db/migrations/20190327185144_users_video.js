const { onUpdateTrigger } = require('../sqlHelpers/update_at');

exports.up = knex => knex.schema.createTable('users_video', (table) => {
  table.increments();
  table.integer('user_id').notNullable();
  table.integer('video_id').notNullable();

  table.timestamps(false, true);

  table.foreign('user_id').references('id').inTable('users');
  table.foreign('video_id').references('id').inTable('video');
}).then(() => knex.raw(onUpdateTrigger('users_video')));

exports.down = knex => knex.schema.dropTable('users_video');

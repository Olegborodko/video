const { onUpdateTrigger } = require('../sqlHelpers/update_at');

exports.up = knex => knex.schema.createTable('video', (table) => {
  table.increments();
  table.string('title').notNullable();
  table.string('link').notNullable();
  table.timestamps(false, true);

  table.unique('link');
}).then(() => knex.raw(onUpdateTrigger('video')));

exports.down = knex => knex.schema.dropTable('video');

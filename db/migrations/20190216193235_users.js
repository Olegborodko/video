const { onUpdateTrigger } = require('../sqlHelpers/update_at');

exports.up = knex => knex.schema.createTable('users', (table) => {
  table.increments();
  table.string('email').notNullable();
  table.string('password').notNullable();
  table.string('login').notNullable();
  table.string('token');
  table.boolean('night_mode').notNullable().defaultTo(false);
  table.timestamps(false, true);

  table.unique('email');
  table.unique('login');
}).then(() => knex.raw(onUpdateTrigger('users')));

exports.down = knex => knex.schema.dropTable('users');

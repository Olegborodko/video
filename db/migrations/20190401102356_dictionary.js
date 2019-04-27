const { onUpdateTrigger } = require('../sqlHelpers/update_at');

exports.up = function (knex) {
  return knex.schema.createTable('dictionary', (table) => {
    table.increments();
    table.string('en').notNullable();
    table.string('ru').notNullable();
    table.integer('counter');
    table.boolean('protect').defaultTo(false);
    table.timestamps(false, true);

    table.unique('en');
  }).then(() => knex.raw(onUpdateTrigger('dictionary')));
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('dictionary');
};

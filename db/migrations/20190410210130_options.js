const { onUpdateTrigger } = require('../sqlHelpers/update_at');

exports.up = function(knex, Promise) {
    return knex.schema.createTable('options', (table) => {
    table.increments();
    table.string('key').notNullable();
    table.text('value').notNullable();
    table.timestamps(false, true);

    table.unique('key');
  }).then(() => knex.raw(onUpdateTrigger('options')));
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('options');
};

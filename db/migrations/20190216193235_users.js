const { onUpdateTrigger } = require('../../config/update_at');

exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', (table) => {
        table.increments();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.string('login').notNullable();
        table.boolean('night_mode').notNullable().defaultTo(false);
        table.timestamps(false, true);

        table.unique('email');
        table.unique('login');
    }).then(() => knex.raw(onUpdateTrigger('users')));
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users');
};

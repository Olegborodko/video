const { bcryptHashSync } = require ('../../config/bcrypt');

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
          {
              id: 1,
              email: '1@gmail.com',
              password: bcryptHashSync('123'),
              login: '1',
              night_mode: true
          },
          {
              id: 2,
              email: '2@gmail.com',
              password: bcryptHashSync('123'),
              login: '2',
              night_mode: false
          }
      ]);
    });
};

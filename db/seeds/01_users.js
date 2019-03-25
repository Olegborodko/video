const { bcryptHashSync } = require('../../config/bcrypt');

exports.seed = knex => knex('users').del()
  .then(() => knex('users').insert([
    {
      email: '1@gmail.com',
      password: bcryptHashSync('123'),
      name: '1',
      night_mode: true,
    },
    {
      email: '2@gmail.com',
      password: bcryptHashSync('123'),
      name: '2',
      night_mode: false,
    },
  ]));

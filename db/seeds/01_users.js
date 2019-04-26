const config = require('../../config/config');
const { bcryptHashSync } = require('../../config/bcrypt');

exports.seed = knex => knex('users').del()
  .then(() => knex('users').insert([
    {
      email: 'admin_test@gmail.com',
      password: bcryptHashSync('123'),
      name: 'admin_test',
      night_mode: true,
    },
    {
      email: '2@gmail.com',
      password: bcryptHashSync('123'),
      name: '2',
      night_mode: false,
    },
    {
      email: config.general.adminEmail,
      password: bcryptHashSync(config.general.adminPassword),
      name: config.general.adminName,
      night_mode: false,
    },
  ]));

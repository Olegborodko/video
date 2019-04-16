require('dotenv').config();
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
      email: process.env.ADMIN_EMAIL,
      password: bcryptHashSync(process.env.ADMIN_PASSWORD),
      name: process.env.ADMIN_NAME,
      night_mode: false,
    },
  ]));

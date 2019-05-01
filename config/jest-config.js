const knex = require('../config/knex');
const config = require('../config/config');
const { bcryptHashSync } = require('../config/bcrypt');

module.exports = async () => {
  // only work with db, server is not running yet
  await knex('dictionary').truncate();

  await knex.raw('TRUNCATE TABLE users, users_video CASCADE');

  await knex('users').insert({
    name: config.general.adminName,
    email: config.general.adminEmail,
    password: bcryptHashSync(config.general.adminPassword),
  });

  await knex('users').insert({
    name: config.general.userTestName,
    email: config.general.userTestEmail,
    password: bcryptHashSync(config.general.userTestPassword),
  });

  return true;
};

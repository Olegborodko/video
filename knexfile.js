require('dotenv').config();

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: process.env.DEV_DB,
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASS,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },

  test: {
    client: 'postgresql',
    connection: {
      database: process.env.TEST_DB,
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASS,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },

};

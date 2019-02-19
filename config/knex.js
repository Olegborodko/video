require('dotenv').config();
const knexConfig = require('../knexfile');

const environment = process.env.NODE_ENV || 'development';
const configEnv = knexConfig[environment];

module.exports = require('knex')(configEnv);
const config = require('./config');
const knexConfig = require('../knexfile');

const environment = config.general.nodeEnv;
const configEnv = knexConfig[environment];

module.exports = require('knex')(configEnv);

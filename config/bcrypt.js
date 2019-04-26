const bcrypt = require('bcrypt');
const { promisify } = require('util');
const config = require('./config');

const bcryptHashPromice = promisify(bcrypt.hash);
const bcryptComparePromice = promisify(bcrypt.compare);

const saltRounds = parseInt(config.general.saltRounds, 10);

module.exports.bcryptHashSync = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

module.exports.bcryptComparePromice = bcryptComparePromice;

module.exports.bcryptHashPromice = bcryptHashPromice;

module.exports.saltRounds = saltRounds;

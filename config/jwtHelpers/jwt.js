const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports.jwtEncode = (data, time) => jwt.sign(
  {
    data,
  },
  config.general.jwtSecret,
  {
    expiresIn: time,
  },
);

module.exports.jwtDecode = (token) => {
  try {
    return jwt.verify(token, config.general.jwtSecret);
  } catch (err) {
    return false;
  }
};

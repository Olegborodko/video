require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.jwtEncode = (data, time) => jwt.sign(
  {
    data,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: time,
  },
);

module.exports.jwtDecode = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return false;
  }
};

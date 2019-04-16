require('dotenv').config();
const { jwtDecode } = require('../../../config/jwtHelpers/jwt');
const knex = require('../../../config/knex');

module.exports = async (tokenAccess) => {
  const tokenData = jwtDecode(tokenAccess);
  if (!tokenData) {
    return false;
  }
  const userId = tokenData.data;

  return await knex('users').where('id', userId).select('email').then((data) => {
    if (
      data.length > 0 &&
      data[0].hasOwnProperty('email') &&
      data[0].email === process.env.ADMIN_EMAIL
    ) {
      return true;
    };
    return false;
  });

};
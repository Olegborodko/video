const { jwtDecode } = require('../../../config/jwtHelpers/jwt');

module.exports = (tokenAccess) => {
  const tokenData = jwtDecode(tokenAccess);

  if (tokenData) {
    return tokenData.data;
  }
  return false;
};

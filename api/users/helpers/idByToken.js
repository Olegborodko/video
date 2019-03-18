const { jwtDecode } = require('../../../config/jwtHelpers/jwt');

module.exports = (token_access) => {
  const tokenData = jwtDecode(token_access);

  if (tokenData) {
    return tokenData.data;
  }
    	return false;
};

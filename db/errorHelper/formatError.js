const config = require('../../config/config');

module.exports = (error) => {
  const result = {};

  if (error.code === config.errors.db.alreadyExist) {
    if (error.constraint) {
      const key = error.constraint.split('_')[1];
      if (key) {
        result[key] = { 0: 'already exists' };
        return result;
      }
    }
  }

  result.database = { 0: 'error' };
  return result;
};

const knex = require('../../../config/knex');

async function wordsNumber() {
  return await knex('dictionary').count('*');
}

async function getLastElementId() {
  const result = await knex.raw(
    'SELECT * FROM dictionary ORDER BY ID DESC LIMIT 1',
  );
  if (result) {
    return result.rows[0].id;
  } else {
    return false;
  }
}

module.exports.wordsNumber = wordsNumber;
module.exports.getLastElementId = getLastElementId;

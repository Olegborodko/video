require('dotenv').config();
const requestPromise = require('request-promise');
const knex = require('../../../config/knex');

async function getTokenFromLingvo() {
  const options = {
    uri: 'https://developers.lingvolive.com/api/v1.1/authenticate',
    method: 'POST',
    body: {
      "mode": "formdata",
      "formdata": []
    },
    headers: {
      'Authorization': `Basic ${process.env.LINGVO_KEY}`
    },
    json: true
  };
  return await requestPromise(options).catch(() => false);
};

async function translate(token, text) {
  const options = {
    uri: '{{apiUrl}}/api/v1/Minicard',
    method: 'GET',
    qs: {
      text: text,
      srcLang: 1033,
      dstLang: 1049
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    json: true
  };
  return await requestPromise(options).then((data) => 
    {
      return data.Translation.Translation 
    }).catch(() => false);
};

async function getTokenFromDb() {
    return await knex('options').where('key', 'tokenLingvo').then((data) => {
    if (data.length > 0) {
      return data[0].value;
    } else {
      return false;
    }
  });
}

async function setTokenToDb(token) {
  return await knex('options').returning('id').insert({
    value: token,
    key: 'tokenLingvo'
  })
}

async function tokenRefreshDb(token) {
  return await knex('options').where('key', 'tokenLingvo').update({
    value: token
  });
}

module.exports.getTokenLingvo = getTokenFromLingvo;
module.exports.translate = translate;
module.exports.getTokenFromDb = getTokenFromDb;
module.exports.setTokenToDb = setTokenToDb;
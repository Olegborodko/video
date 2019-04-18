require('dotenv').config();
const requestPromise = require('request-promise');
const knex = require('../../../config/knex');

async function getTokenFromLingvo() {
  const options = {
    uri: 'https://developers.lingvolive.com/api/v1.1/authenticate',
    method: 'POST',
    resolveWithFullResponse: true,
    body: {
      "mode": "formdata",
      "formdata": []
    },
    headers: {
      'Authorization': `Basic ${process.env.LINGVO_KEY}`
    },
    json: true
  };
  return await requestPromise(options).then((data) => {
    if (data.statusCode === 200) {
      return data.body;
    } else {
      return false;
    }
  });
};

async function translate(token, text) {
  const options = {
    uri: 'https://developers.lingvolive.com/api/v1/Minicard',
    method: 'GET',
    simple: false,
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
  return await requestPromise(options).then((data) => {
    if (data && data.Translation && data.Translation.Translation) {
      return data.Translation.Translation
    } else {
      return false;
    }
  });
};

async function getTokenFromDb() {
  return await knex('options').where('key', 'tokenLingvo').then((data) => {
    if (data.length > 0 && data[0].hasOwnProperty('value')) {
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

// async function tokenRefreshDb(token) {
//   return await knex('options').where('key', 'tokenLingvo').update({
//     value: token
//   });
// }

async function refreshToken() {
  newToken = await getTokenFromLingvo();
  if (newToken) {
    await setTokenToDb(newToken);
    return newToken;
  }
  return false;
}

async function testTranslate(token) {
  const russianWord = await translate(token, 'a');
  if (russianWord) {
    return token;
  }

  const newToken = await getTokenFromLingvo();
  if (newToken) {
    return newToken;
  }

  return false;
}

async function saveWordToDb(dataForInsert) {
  return await knex('dictionary').insert(
    dataForInsert
  ).then(() => {
    return true;
  }).catch((error) => {
    //dublicate key en word
    if (error.code === '23505') {
      return true;
    }
    return false;
  });
}

module.exports.getTokenFromLingvo = getTokenFromLingvo;
module.exports.translate = translate;
module.exports.getTokenFromDb = getTokenFromDb;
module.exports.setTokenToDb = setTokenToDb;
module.exports.saveWordToDb = saveWordToDb;
module.exports.testTranslate = testTranslate;
module.exports.refreshToken = refreshToken;

require('dotenv').config();
const fs = require('fs');
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

function getTokenFromFile() {
  const result = fs.readFileSync('./db/tokenLingvo.js', { encoding: 'utf-8' });
  if (result.length > 0){
    return result;  
  }
  return false;
}

function setTokenToFile(token) {
  fs.writeFileSync("./db/tokenLingvo.js", token);
}

async function refreshToken() {
  const newToken = await getTokenFromLingvo();
  if (newToken) {
    setTokenToFile(newToken);
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
module.exports.getTokenFromFile = getTokenFromFile;
module.exports.setTokenToFile = setTokenToFile;
module.exports.saveWordToDb = saveWordToDb;
module.exports.testTranslate = testTranslate;
module.exports.refreshToken = refreshToken;
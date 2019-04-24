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
      mode: 'formdata',
      formdata: [],
    },
    headers: {
      Authorization: `Basic ${process.env.LINGVO_KEY}`,
    },
    json: true,
  };

  const result = await requestPromise(options).then(data => {
    if (data.statusCode === 200) {
      return data.body;
    }
    return false;
  });

  return result;
}

async function translate(token, text) {
  const options = {
    uri: 'https://developers.lingvolive.com/api/v1/Minicard',
    method: 'GET',
    simple: false,
    qs: {
      text,
      srcLang: 1033,
      dstLang: 1049,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    json: true,
  };
  const result = await requestPromise(options).then(data => {
    if (data && data.Translation && data.Translation.Translation) {
      return {
        ru: data.Translation.Translation,
        en: text,
      };
    }
    return false;
  });

  return result;
}

function getTokenFromFile() {
  const result = fs.readFileSync('./db/tokenLingvo.js', { encoding: 'utf-8' });
  if (result.length > 0) {
    return result;
  }
  return false;
}

function setTokenToFile(token) {
  fs.writeFileSync('./db/tokenLingvo.js', token);
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
  const result = await knex('dictionary')
    .insert(dataForInsert)
    .then(() => true)
    .catch(error => {
      // dublicate key en word
      if (error.code === '23505') {
        return true;
      }
      throw error;
    });

  return result;
}

async function getCorrectToken() {
  let token = getTokenFromFile();

  if (!token) {
    token = await refreshToken();
  }

  token = await testTranslate(token);
  if (token) {
    return token;
  }

  return false;
}

async function translateAndSave(token, enWord) {
  const translateResult = await translate(token, enWord);

  if (translateResult) {
    const data = {
      en: translateResult.en,
      ru: translateResult.ru,
      counter: 1,
    };

    if (await saveWordToDb(data)) {
      return translateResult.ru;
    }
  }

  return false;
}

// module.exports.getTokenFromLingvo = getTokenFromLingvo;
// module.exports.translate = translate;
// module.exports.getTokenFromFile = getTokenFromFile;
// module.exports.setTokenToFile = setTokenToFile;
// module.exports.saveWordToDb = saveWordToDb;
// module.exports.testTranslate = testTranslate;
// module.exports.refreshToken = refreshToken;

module.exports.getCorrectToken = getCorrectToken;
module.exports.translateAndSave = translateAndSave;

const fs = require('fs');
const requestPromise = require('request-promise');
const config = require('../../../config/config');
const knex = require('../../../config/knex');
const redisModule = require('../../../config/redis');

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
      Authorization: `Basic ${config.general.lingvoKey}`,
    },
    json: true,
  };

  const result = await requestPromise(options).then((data) => {
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
    resolveWithFullResponse: true,
    simple: false,
    qs: {
      text,
      srcLang: config.general.translateFrom,
      dstLang: config.general.translateTo,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    json: true,
  };
  const result = await requestPromise(options).then((data) => {
    console.log(data);
    if (data.statusCode === 401) {
      return '401';
    }
    if (
      data
      && data.body
      && data.body.Translation
      && data.body.Translation.Translation
    ) {
      return {
        ru: data.body.Translation.Translation,
        en: text,
      };
    }
    return false;
  });

  console.log(result);
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

// async function testTranslate(token) {
//   const russianWord = await translate(token, 'a');

//   if (russianWord) {
//     return token;
//   }

//   const newToken = await getTokenFromLingvo();

//   if (newToken) {
//     return newToken;
//   }

//   return false;
// }

async function saveWordToDb(dataForInsert) {
  const result = await knex('dictionary')
    .insert(dataForInsert)
    .then(() => true)
    .catch((error) => {
      // dublicate key en word
      if (error.code === config.errors.db.alreadyExist) {
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

  if (token) {
    return token;
  }

  return false;
}

async function translateAndSave(token, enWord) {
  const translateResult = await translate(token, enWord);

  const data = {
    en: enWord,
    counter: 1,
  };

  if (translateResult === '401') {
    return '';
  }

  if (translateResult) {
    data.ru = translateResult.ru;
  } else {
    data.ru = '';
  }

  redisModule.client.hmset('words', enWord, data.ru);
  saveWordToDb(data);

  return data.ru;
}

// module.exports.getTokenFromLingvo = getTokenFromLingvo;
// module.exports.translate = translate;
// module.exports.getTokenFromFile = getTokenFromFile;
// module.exports.setTokenToFile = setTokenToFile;
// module.exports.saveWordToDb = saveWordToDb;
// module.exports.testTranslate = testTranslate;
module.exports.refreshToken = refreshToken;

module.exports.getCorrectToken = getCorrectToken;
module.exports.translateAndSave = translateAndSave;

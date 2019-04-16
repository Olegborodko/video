require('dotenv').config();
const Router = require('koa-router');

const router = new Router();
const requestPromise = require('request-promise');
const knex = require('../../config/knex');
const translateApi = require('./helpers/translateApi');

const wordsSchema = require('../joiHelpers/schemes/words');
const runValidation = require('../joiHelpers/runValidation');

const currentUserIsAdmin = require('./helpers/ifAdmin');

router.post('/api/admin/wordsToDb', async (ctx) => {
  if (! await currentUserIsAdmin(ctx.cookies.get('token_access'))) {
    ctx.response.body = { errors: "Access not allowed" };
    ctx.response.status = 401;
    return;
  }

  const { words } = ctx.request.body;

  const errors = runValidation(ctx.request.body, wordsSchema);

  if (errors) {
    ctx.response.body = { errors };
    ctx.response.status = 404;
    return;
  }

  // const test = await translateApi.getTokenFromLingvo();
  // const translate1 = await translateApi.translate(test, 'hello');
  // ctx.response.body = { test: translate1 }
  // ctx.response.status = 200;
  // return;

  async function refreshToken() {
    newToken = await translateApi.getTokenFromLingvo();
    if (newToken) {
      await translateApi.setTokenToDb(newToken);
      return newToken;
    }
    return false;
  }

  async function testToken(token) {
    const russianWord = await translateApi.translate(token, 'hello');
    if (russianWord) {
      return token;
    }
    
    const newToken = await refreshToken();
    if (newToken) {
      return newToken;
    }

    return false;
  }


  let token = await translateApi.getTokenFromDb();

  if (!token) {
    token = await refreshToken();

    if (!token) {
      ctx.response.body = { "errors": "Error access to Lingvo" };
      ctx.response.status = 401;
      return;
    }
  }

  token = await testToken(token);
  if (!token) {
    ctx.response.body = { "errors": "Error access to Lingvo" };
    ctx.response.status = 401;
  }

  const wordsObject = {};

  for (key in words) {
    if (words[key] === true) {
      //translate word
      const russianWord = await translateApi.translate(token, key);
      if (russianWord) {
        wordsObject[key] = russianWord;
      }

      //save to db
    } else {
      wordsObject[key] = words[key];
    }
    
    //console.log(value);
        // await knex('dictionary').where('en', correctWord).then((data) => {
        //   if (data.length > 0) {
        //     // console.log(`${data[0].en} -- ${data[0].ru}`);
        //     wordsObject[correctWord] = data[0].ru;
        //   } 
        // });
  }

  ctx.response.body = {
    words: wordsObject,
  };

  ctx.response.status = 200;
});

module.exports = router;

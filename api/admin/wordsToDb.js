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
  if (!await currentUserIsAdmin(ctx.cookies.get('token_access'))) {
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

  async function refreshToken() {
    newToken = await translateApi.getTokenFromLingvo();
    if (newToken) {
      await translateApi.setTokenToDb(newToken);
      return newToken;
    }
    return false;
  }

  async function testToken(token) {
    const russianWord = await translateApi.translate(token, 'a');
    if (russianWord) {
      return token;
    }

    const newToken = await refreshToken();
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
        //save to db
        const data = {
          en: key,
          ru: russianWord,
          counter: 1
        };
        if (!await saveWordToDb(data)) {
          ctx.response.body = { errors: "Error insert to database dictionary" }
          ctx.response.status = 400;
          return;
        }
      }
    } else {
      wordsObject[key] = words[key];
    }
  }

  ctx.response.body = {
    words: wordsObject,
  };

  ctx.response.status = 200;
});

module.exports = router;

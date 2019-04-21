require('dotenv').config();
const Router = require('koa-router');

const router = new Router();
const translateApi = require('./helpers/translateApi');

const wordsSchema = require('../joiHelpers/schemes/words');
const runValidation = require('../joiHelpers/runValidation');

const currentUserIsAdmin = require('./helpers/ifAdmin');

router.post('/api/admin/wordsToDb', async (ctx) => {
  if (!(await currentUserIsAdmin(ctx.cookies.get('token_access')))) {
    ctx.response.body = { errors: 'Access not allowed' };
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

  let token = translateApi.getTokenFromFile();

  if (!token) {
    token = await translateApi.refreshToken();

    if (!token) {
      ctx.response.body = { errors: 'Error access to Lingvo' };
      ctx.response.status = 401;
      return;
    }
  }

  token = await translateApi.testTranslate(token);

  if (!token) {
    ctx.response.body = { errors: 'Error access to Lingvo' };
    ctx.response.status = 401;
  }

  const wordsObject = {};
  const promicesArray = [];

  async function translateAndSave(enWord) {
    const result = translateApi.translate(token, enWord).then((res) => {
      if (res) {
        const data = {
          en: res.en,
          ru: res.ru,
          counter: 1,
        };
        wordsObject[enWord] = res.ru;
        translateApi.saveWordToDb(data);
      }
    });

    return result;
  }

  Object.entries(words).forEach((arrayFromObject) => {
    const key = arrayFromObject[0];
    const value = arrayFromObject[1];
    if (value === true) {
      promicesArray.push(translateAndSave(key));
    } else {
      wordsObject[key] = value;
    }
  });

  await Promise.all(promicesArray);

  ctx.response.body = {
    words: wordsObject,
  };

  ctx.response.status = 200;
});

module.exports = router;

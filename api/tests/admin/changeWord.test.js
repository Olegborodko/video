const request = require('supertest');
const server = require('../../../app');
const helpersUser = require('../helpers/users');
const helpersDictionary = require('../helpers/dictionary');

const knex = require('../../../config/knex');

const config = require('../../../config/config');

let cookieAdmin;
beforeAll(async done => {
  await knex('dictionary').truncate();
  await knex('dictionary').insert([
    {
      en: 'hello',
      ru: 'привет',
      counter: 1,
      protect: true,
    },
    {
      en: 'a',
      ru: 'неопределенный',
      counter: 2,
      protect: false,
    },
    {
      en: 'adsa',
      ru: '',
      counter: 1,
      protect: false,
    },
    {
      en: 'my',
      ru: 'мой',
      counter: 1,
      protect: true,
    },
    {
      en: 'i',
      ru: 'я',
      counter: 1,
      protect: false,
    },
  ]);

  await knex.raw('TRUNCATE TABLE users, users_video CASCADE');

  cookieAdmin = await helpersUser.createUser(
    config.general.adminPassword,
    config.general.adminEmail,
    config.general.adminName,
  );

  done();
});

afterAll(() => {
  server.close();
});

describe('/api/admin/changeWord', () => {
  test('200', async () => {
    const wordId = await helpersDictionary.getLastElementId();
    const response = await request(server)
      .post('/api/admin/changeWord')
      .set('Cookie', [`${cookieAdmin}`])
      .send({
        id: wordId,
        ru: 'новый перевод',
      });

    expect(response.status).toEqual(200);
  });
});

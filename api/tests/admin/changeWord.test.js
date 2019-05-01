const request = require('supertest');

const server = require('../../../app');
const helpersUser = require('../helpers/users');
const helpersDictionary = require('../helpers/dictionary');
const knex = require('../../../config/knex');
const config = require('../../../config/config');

let cookieAdmin;
beforeAll(async done => {
  await knex('dictionary').insert([
    {
      en: 'i',
      ru: 'я',
      counter: 1,
      protect: false,
    },
  ]);

  cookieAdmin = await helpersUser.login(
    config.general.adminPassword,
    config.general.adminEmail,
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

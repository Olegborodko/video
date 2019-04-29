const request = require('supertest');
const knex = require('../../../config/knex');

const server = require('../../../app');
const config = require('../../../config/config');

const { createUser, login } = require('../helpers/users');
const { wordsNumber, getLastElementId } = require('../helpers/dictionary');

let newUser, cookieUser, cookieAdmin;
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
  done();
});

afterAll(() => {});

describe('/api/admin/deleteWords', () => {
  test('401 not access', async () => {
    const response = await request(server)
      .post('/api/admin/deleteWords')
      .send();

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('errors');
  });

  test('403 errors without params', async () => {
    cookieAdmin = await createUser(
      config.general.adminPassword,
      config.general.adminEmail,
      config.general.adminName,
    );

    const response = await request(server)
      .post('/api/admin/deleteWords')
      .set('Cookie', [`${cookieAdmin}`])
      .send();

    expect(response.status).toEqual(403);
    expect(response.body).toHaveProperty('errors');
  });

  test('200 counter', async () => {
    cookieAdmin = await login(
      config.general.adminPassword,
      config.general.adminEmail,
    );

    numberWords = await wordsNumber();
    expect(numberWords[0].count).toEqual('5');

    const response = await request(server)
      .post('/api/admin/deleteWords')
      .set('Cookie', [`${cookieAdmin}`])
      .send({
        counter: 2,
      });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success');
    numberWords = await wordsNumber();
    expect(numberWords[0].count).toEqual('4');
  });

  test('200 ids', async () => {
    const lastElement = await getLastElementId();

    const response = await request(server)
      .post('/api/admin/deleteWords')
      .set('Cookie', [`${cookieAdmin}`])
      .send({
        ids: [lastElement],
      });

    numberWords = await wordsNumber();
    expect(numberWords[0].count).toEqual('3');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success');
  });

  test('200 withoutTranslation', async () => {
    const response = await request(server)
      .post('/api/admin/deleteWords')
      .set('Cookie', [`${cookieAdmin}`])
      .send({
        withoutTranslation: true,
      });

    numberWords = await wordsNumber();
    expect(numberWords[0].count).toEqual('2');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success');
  });

  test('400 protect words', async () => {
    const response = await request(server)
      .post('/api/admin/deleteWords')
      .set('Cookie', [`${cookieAdmin}`])
      .send({
        counter: 1,
      });

    numberWords = await wordsNumber();
    expect(numberWords[0].count).toEqual('2');
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('errors');
  });
});

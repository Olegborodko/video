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
      en: 'we',
      ru: 'мы',
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

describe('/api/admin/deleteWords', () => {
  test('401 not access', async done => {
    const response = await request(server)
      .post('/api/admin/deleteWords')
      .send();

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('errors');
    done();
  });

  test('400 errors without params', async done => {
    const response = await request(server)
      .post('/api/admin/deleteWords')
      .set('Cookie', [`${cookieAdmin}`])
      .send();

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('errors');
    done();
  });

  test('200 counter', async done => {
    numberWords = await helpersDictionary.wordsNumber();
    expect(numberWords[0].count).toEqual('5');

    const response = await request(server)
      .post('/api/admin/deleteWords')
      .set('Cookie', [`${cookieAdmin}`])
      .send({
        counter: 2,
      });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success');
    numberWords = await helpersDictionary.wordsNumber();
    expect(numberWords[0].count).toEqual('4');
    done();
  });

  test('200 ids', async done => {
    const lastElement = await helpersDictionary.getLastElementId();

    const response = await request(server)
      .post('/api/admin/deleteWords')
      .set('Cookie', [`${cookieAdmin}`])
      .send({
        ids: [lastElement],
      });

    numberWords = await helpersDictionary.wordsNumber();
    expect(numberWords[0].count).toEqual('3');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success');
    done();
  });

  test('200 withoutTranslation', async done => {
    const response = await request(server)
      .post('/api/admin/deleteWords')
      .set('Cookie', [`${cookieAdmin}`])
      .send({
        withoutTranslation: true,
      });

    numberWords = await helpersDictionary.wordsNumber();
    expect(numberWords[0].count).toEqual('2');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('success');
    done();
  });

  test('400 protect words', async done => {
    const response = await request(server)
      .post('/api/admin/deleteWords')
      .set('Cookie', [`${cookieAdmin}`])
      .send({
        counter: 1,
      });

    numberWords = await helpersDictionary.wordsNumber();
    expect(numberWords[0].count).toEqual('2');
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('errors');
    done();
  });
});

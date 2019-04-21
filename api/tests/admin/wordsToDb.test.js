require('dotenv').config();
const request = require('supertest');
const knex = require('../../../config/knex');
const fs = require('fs');

const server = require('../../../app');
const translateApi = require('../../admin/helpers/translateApi');

beforeAll(async () => {
  fs.writeFileSync('./db/tokenLingvo.js', '');
  await knex('dictionary').truncate();
});

// close the server after each test
afterAll(() => {
  //server.close();
  //console.log('server closed!');
});

async function loginHowAdmin() {
  const requestResult = await request(server)
    .post('/api/users/auth')
    .send({
      password: process.env.ADMIN_PASSWORD,
      email: process.env.ADMIN_EMAIL,
    });

  return requestResult.headers['set-cookie'][0];
}

describe('/api/admin/wordsToDb', () => {
  test('401 not access', async () => {
    const response = await request(server)
      .post('/api/admin/wordsToDb')
      .send({
        words: {
          hello: 'алло!',
          and: true,
        },
      });

    expect(response.status).toEqual(401);

    const token = translateApi.getTokenFromFile();
    expect(token).toBeFalsy();

    expect(response.body).toHaveProperty('errors');
  });

  test('create token in file', async () => {
    const cookie = await loginHowAdmin();

    const response = await request(server)
      .post('/api/admin/wordsToDb')
      .set('Cookie', [`${cookie}`])
      .send({
        words: {
          hello: 'алло!',
          and: true,
        },
      });

    expect(response.status).toEqual(200);

    const token = translateApi.getTokenFromFile();
    expect(token).toBeTruthy();
  });

  test('translate test', async () => {
    const cookie = await loginHowAdmin();

    const response = await request(server)
      .post('/api/admin/wordsToDb')
      .set('Cookie', [`${cookie}`])
      .send({
        words: {
          hello: true,
          and: true,
          lakataka: true,
          a: true,
        },
      });

    //console.log(response.body);
    expect(response.status).toEqual(200);
    expect(response.body.words.hello).toEqual('алло!');
    expect(response.body.words.and).toEqual('и');
    expect(response.body.words.and).not.toBe(true);
    expect(Object.keys(response.body.words).length).toBe(3);

    const countRecords = await knex('dictionary').count('id');
    expect(countRecords[0].count).toBe('3');

    // expect(response.body).toHaveProperty("errors");
  });
});

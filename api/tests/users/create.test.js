const request = require('supertest');
const knex = require('../../../config/knex');

const server = require('../../../app.js');

beforeAll(async () => {
  // do something before anything else runs
  await knex('users').truncate();
  console.log('Jest starting!');
});

// close the server after each test
afterAll(() => {
  server.close();
  console.log('server closed!');
});

describe('POST /api/users', () => {
  test('success', async () => {
    const response = await request(server).post('/api/users').send(
      { login: 'john12', email: '1@1.com', password: 'ddd111' },
    );

    expect(response.status).toEqual(202);
    expect(response.type).toEqual('application/json');
    expect.stringContaining(response.body.token_refresh);
    // console.log('Cookies: ', response.cookies);
    // expect(response.universalCookies).toEqual('success');
    // expect(response.cookies).toEqual('jwt');
    // expect(response.universalCookies).toEqual('name3');
  });
});

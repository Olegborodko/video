const request = require('supertest');
const server = require('../../../app');

async function createUser(password, email, name) {
  const requestResult = await request(server)
    .post('/api/users/create')
    .send({
      password: password,
      email: email,
      name: name,
    });

  return requestResult.headers['set-cookie'][0];
}

async function login(password, email) {
  const requestResult = await request(server)
    .post('/api/users/auth')
    .send({
      password: password,
      email: email,
    });
  return requestResult.headers['set-cookie'][0];
}

module.exports.createUser = createUser;
module.exports.login = login;

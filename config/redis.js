const redis = require('redis');
const { promisify } = require('util');
const config = require('./config');

let client = redis.createClient();
if (config.general.nodeEnv === 'production') {
  client = redis.createClient(config.general.redisURL);
}

const getAsync = promisify(client.hgetall).bind(client);
const resetData = promisify(client.flushdb).bind(client);
const knex = require('./knex');

client.on('error', (err) => {
  console.log(`Something went wrong with redis, error - ${err}`);
});

module.exports.fillDB = async function () {
  const newObject = {
    test: 'тест',
  };

  await knex
    .select('en', 'ru')
    .from('dictionary')
    .then((data) => {
      data.forEach((item) => {
        newObject[item.en] = item.ru;
      });
    });

  client.hmset('words', newObject);
  return newObject;
};

module.exports.resetData = resetData;
module.exports.client = client;
module.exports.getAsync = getAsync;

// redisModule.getAsync('words').then(function(res) {
//   if (res) {
//     console.log(res['hello']);
//   } else {
//     //null
//   }
// });

// client.hmset('words', objectWords);

// client.hgetall("words", function (err, replies) {
//     console.log(replies['test 1']);
// });

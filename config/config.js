require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const general = {
  nodeEnv: env,

  adminName: process.env.ADMIN_NAME || 'admin',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'adminadmin',

  userTestName: 'userTest',
  userTestEmail: 'userTest@gmail.com',
  userTestPassword: 'userTest',

  jwtSecret: process.env.JWT_SECRET || 'test',
  saltRounds: process.env.SALT_ROUNDS || '10',

  youtubeKey: process.env.YOUTUBE_KEY,
  lingvoKey: process.env.LINGVO_KEY,

  translateFrom: '1033',
  translateTo: '1049',

  tokenAccessTime: process.env.TOKEN_ACCESS_TIME || '30m',
  tokenRefreshTime: process.env.TOKEN_REFRESH_TIME || '30d',

  redisURL: process.env.REDIS_URL,
  redisHOST: process.env.REDIS_HOST || '127.0.0.1',
  redisPORT: process.env.REDIS_PORT || 6379,
};

const errors = {
  db: {
    alreadyExist: '23505',
    noSuchRelation: '23503',
  },
};

const development = {
  general,
  errors,
  db: process.env.POSTGRES_DB || 'videoplayer',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  hostDb: process.env.HOST_DB || 'localhost',
  host: 'localhost',
  port: '3000',
};

const test = {
  general,
  errors,
  db: 'videoplayer_test',
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: '3001',
};

const production = {
  general,
  errors,
  dbUrl: process.env.DATABASE_URL,
  host: process.env.HOST,
  port: process.env.PORT,
};

// development.general = JSON.parse(JSON.stringify(general));
// test.general = JSON.parse(JSON.stringify(general));
// production.general = JSON.parse(JSON.stringify(general));

const config = {
  development,
  test,
  production,
};

module.exports = config[env];

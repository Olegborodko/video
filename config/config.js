require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const general = {
  nodeEnv: env,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '3000',

  adminName: process.env.ADMIN_NAME || 'admin',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'adminadmin',

  jwtSecret: process.env.JWT_SECRET || 'test',
  saltRounds: process.env.SALT_ROUNDS || '10',

  youtubeKey: process.env.YOUTUBE_KEY,
  lingvoKey: process.env.LINGVO_KEY,

  translateFrom: '1033',
  translateTo: '1049',

  tokenAccessTime: '30m',
  tokenRefreshTime: '30d',
};

const errors = {
  db: {
    alreadyExist: '23505',
  },
};

const development = {
  general,
  errors,
  db: 'videoplayer',
  user: 'postgres',
  password: 'postgres',
};

const test = {
  general,
  errors,
  db: 'videoplayer_test',
  user: 'postgres',
  password: 'postgres',
};

const production = {
  general,
  errors,
  dbUrl: process.env.DATABASE_URL,
};

const config = {
  development,
  test,
  production,
};

module.exports = config[env];

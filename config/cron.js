const { CronJob } = require('cron');
const { refreshToken } = require('../api/video/helpers/translateApi');

const job = new CronJob('0 0 */12 * * *', () => {
  // const d = new Date();
  refreshToken().then();
});

module.exports = () => {
  job.start();
};

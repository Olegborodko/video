const Router = require('koa-router');
const router = new Router();

router.get('/api/users', (ctx, next) => {
    ctx.body = 'All users';
});

module.exports = router;
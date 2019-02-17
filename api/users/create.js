const Router = require('koa-router');
const router = new Router();

router.post('/api/users', (ctx, next) => {
    ctx.body = 'User created';
});

module.exports = router;
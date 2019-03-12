const Router = require('koa-router');
const router = new Router();

router.post('/api/users/logout', async (ctx, next) => {

    ctx.cookies.set('token_access', '');
    ctx.response.body = { "success": "logout" };
    ctx.response.status = 200;

});

module.exports = router;
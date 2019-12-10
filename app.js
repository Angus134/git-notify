
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import buRouter from './routers/branch-update';
import logger from './plugins/logger';

const app = new Koa();
const appRouter = new Router();
const PORT = 8887;

// 根路由 测试添加一行
appRouter.get('/', async(ctx, next) => {
    await next()
});

app.use(bodyParser());
app.use(logger());
app.use(buRouter.routes());
app.use(appRouter.routes());
app.listen(PORT, (err) => {
    console.log(`please open http://127.0.0.1:${PORT}`);
})
const Koa = require('koa');
const router = require('koa-router')();

// 实例化
const app = new Koa();

// 下面是2个接口
router.get('/api/user', async(ctx) => {
  ctx.body = {
    data: { name: 'chb', age: 31 },
    code: 200
  }
})
router.get('/api/list', async(ctx) => {
  ctx.body = {
    code: 200,
    data: [
      { name: '111', id: '1' },
      { name: '222', id: '2' },
    ]
  }
})

app.use(router.routes()); // 启动路由
app.use(router.allowedMethods());

app.listen(3003);
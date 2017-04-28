import test from 'ava'
import request from 'supertest'
import generalRouter from '../../api/general'

const Koa = require('koa')
const app = new Koa()
app.use(generalRouter.routes())
app.use(generalRouter.allowedMethods())

test('General API', async t => {
  const res = await request(app.listen()).get('/')
  t.is(res.status, 200)
  t.deepEqual(res.body, {
    status: 200,
    success: true
  })
})

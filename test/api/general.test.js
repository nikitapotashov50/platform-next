const test = require('ava')
const request = require('supertest')
const generalRouter = require('../../server/routes/api/general')

const Koa = require('koa')
const app = new Koa()
app.use(generalRouter.routes())
app.use(generalRouter.allowedMethods())

test('General API: GET /', async t => {
  const res = await request(app.listen()).get('/')
  t.is(res.status, 200)
  t.deepEqual(res.body, {
    status: 200,
    success: true
  })
})

test('General API: GET /version', async t => {
  const res = await request(app.listen()).get('/version')
  t.is(res.status, 200)
  t.deepEqual(res.body, {
    version: 'v1'
  })
})

test('General API: POST /login', async t => {
  const res = await request(app.listen()).post('/login')
  t.is(res.status, 200)
  t.deepEqual(res.body, {
    ok: true
  })
})

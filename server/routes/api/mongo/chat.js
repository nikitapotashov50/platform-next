const axios = require('axios')
const qs = require('qs')
const { orderBy } = require('lodash')
const { models } = require('mongoose')

const baseUrl = 'http://bmchat.maximumsoft.ru'

module.exports = router => {
  // авторизоваться в радаре
  router.post('/login', async ctx => {
    try {
      const userId = ctx.session.user._id

      const user = await models.Users.findOne({
        _id: userId
      })

      const { email } = user
      const { password } = ctx.request.body

      const { data } = await axios.post(`${baseUrl}/auth/login/`, {
        email,
        password
      }, {
        transformRequest: data => {
          return qs.stringify(data)
        }
      })

      const { accessToken } = data

      const userProfile = await axios(`${baseUrl}/user/me/`, {
        params: {
          accessToken
        }
      })

      const { profile } = userProfile.data
      const radarId = profile.userId

      await user.updateMeta({
        radar_id: radarId,
        radar_access_token: accessToken
      })

      ctx.session.user = Object.assign({}, ctx.session.user, {
        radar_id: radarId,
        radar_access_token: accessToken
      })

      ctx.body = {
        radar_id: radarId,
        radar_access_token: accessToken
      }
    } catch (e) {
      console.log(e)
      ctx.statusCode = 500
    }
  })

  // получить access_token
  router.get('/access_token', async ctx => {
    try {
      const token = ctx.session.user.radar_access_token
      ctx.body = token
    } catch (e) {
      console.log(e)
      ctx.statusCode = 500
    }
  })

  // список чатов
  router.get('/list', async ctx => {
    ctx.log.info('session', ctx.session)

    const token = ctx.session.user.radar_access_token
    if (token) {
      const { data } = await axios(`${baseUrl}/user/me/chat/`, {
        params: {
          accessToken: token
        }
      })

      ctx.body = data
    }
  })

  // новый одиночный чат
  router.post('/dialog', async ctx => {
    try {
      const token = ctx.session.user.radar_access_token
      const { userId } = ctx.request.body

      if (token && userId) {
        const { data } = await axios.put(`${baseUrl}/chat/dialog/`, {
          accessToken: token,
          userId: userId
        }, {
          transformRequest: data => {
            return qs.stringify(data)
          }
        })

        ctx.body = data
      }
    } catch (e) {
      console.log(e)
      ctx.statusCode = 500
      ctx.body = e
    }
  })

  // список сообщений для чата
  router.get('/:chatId/message', async ctx => {
    const token = ctx.session.user.radar_access_token
    const chatId = ctx.params.chatId
    const { lastMessageId } = ctx.request.query

    if (token) {
      const { data } = await axios(`${baseUrl}/chat/dialog/${chatId}/message/`, {
        params: {
          accessToken: token,
          limit: 20,
          lastMessageId
        }
      })

      ctx.body = {
        messages: orderBy(data.messages, ['date'], ['asc'])
      }
    }
  })

  // написать сообщение в чат
  router.post('/:chatId/message', async ctx => {
    const token = ctx.session.user.radar_access_token
    const chatId = ctx.params.chatId
    const text = ctx.request.body.text
    if (token) {
      const { data } = await axios.post(`${baseUrl}/chat/dialog/${chatId}/message/`, {
        accessToken: token,
        text
      }, {
        transformRequest: data => {
          return qs.stringify(data)
        }
      })

      ctx.body = data
    }
  })
}

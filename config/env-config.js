const config = require('.')
const prod = process.env.NODE_ENV === 'production'

module.exports = {
  'BACKEND_URL': prod ? 'https://platform.molodost.bz' : `http://${config.server.host}:${config.server.port}`
}

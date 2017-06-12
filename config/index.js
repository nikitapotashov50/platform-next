module.exports = {
  server: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000
  },
  db: {
    uri: process.env.DB_URI
  },
  api: {
    version: process.env.API_VERSION || 'v1',
    session_key: process.env.SESSION_KEY
  },
  bmapi: {
    client_id: process.env.BM_API_CLIENT_ID,
    client_secret: process.env.BM_API_CLIENT_SECRET
  },
  bmtoken: {
    secret: process.env.BM_TOKEN_ACCESS
  },
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY
  }
}

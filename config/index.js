require('dotenv').config()

/**
 * root config
 * @type {factory}
 */

module.exports = {
  server: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3001
  },
  db: {
    uri: process.env.DB_URI || 'mysql://root:root@localhost:32774/test'
  },
  api: {
    version: process.env.API_VERSION || 'v1',
    session_key: process.env.SESSION_KEY
  },
  bmapi: {
    client_id: 'renat.biktagirov',
    client_secret: '6NbQvMElYMcBbOVWie7a1Bs4rfVt9FpNY4V4Fl6EEGt4xTEUa1K0ugMohlemqFQ5'
  }
}

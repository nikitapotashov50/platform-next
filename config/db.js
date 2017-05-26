require('dotenv').config()

module.exports = {
  development: {
    url: process.env.DB_URI,
    dialect: 'mysql'
  }
}

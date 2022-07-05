require('dotenv').config()
const allowedOrigins = process.env.URL.split(',')
module.exports = allowedOrigins

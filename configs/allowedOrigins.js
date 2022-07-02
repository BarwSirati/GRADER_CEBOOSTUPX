require('dotenv').config()
const allowedOrigins = process.env.URL.split(',')
console.log(allowedOrigins)
module.exports = allowedOrigins

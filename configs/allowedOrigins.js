require('dotenv').config()
const allowedOrigins = [
    `${process.env.FRONTEND_URL}`,
    `${process.env.DEV_FRONTEND_URL}`,
]
console.log(allowedOrigins)
module.exports = allowedOrigins

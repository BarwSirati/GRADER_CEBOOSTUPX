const express = require('express')
const app = express()
const cors = require('cors')
const corsOptions = require('./configs/corsOptions')
const { ValidationError } = require('express-validation')
const { logger } = require('./middleware/logEvents')
const dotenv = require('dotenv')
dotenv.config()

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.urlencoded({ limit: '1mb', extended: false }))

app.get('/', (req, res, next) => {
    res.status(200).send({
        msg: 'THIS IS COMPILER FOR CEBOOSTUPX | KMITL CE60',
    })
    next()
})
app.use('/compile', require('./services/checkResult'))

// Error Handling
app.use((err, req, res, next) => {
    console.log(err)

    err.statusCode = err.statusCode || 404
    err.status = err.status || 'Not Found!'

    res.status(err.statusCode).send({
        status: err.status,
        message: err.cusMessage || 'Unknown Error',
        code: err.code || 0,
    })
    next()
})

module.exports = app

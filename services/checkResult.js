const express = require('express')
const router = express.Router()
const { add_res_queue } = require('../compiler/worker')
const auth = require('../middleware/auth')

const { compileValidation } = require('../validation/compile')

router.get('/', (req, res) => {
    res.status(200).send({ msg: 'WHAT ARE YOU DOING??' })
})
router.post('/', auth, compileValidation, (req, res) => {
    add_res_queue(req, res)
})
module.exports = router

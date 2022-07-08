const { checkResult } = require('./run')
const tress = require('tress')
const axios = require('axios')

const queue = tress((req, next) => {
    try {
        backend(req.body, req.headers).then(() => next())
    } catch (err) {
        console.log(err.message)
    }
}, 1)

exports.add_res_queue = async (req, res) => {
    try {
        queue.push(req)
        res.status(200).send({ msg: 'Req in queue' })
    } catch (err) {
        res.status(304).send({ errMsg: 'Error sendding' })
    }
}

const backend = async ({ questionId, sourceCode }, headers) => {
    const api = process.env.URL.split(',')[0]
    try {
        const authHeader = headers['authorization']
        const user = await axios.get(`${api}/users/current/info`, {
            headers: { Authorization: authHeader },
        })
        const fetchQuestion = await axios.get(
            `${api}/question/grader/${questionId}`,
            { headers: { Authorization: authHeader } }
        )
        
        if (fetchQuestion.data._id && user.data) {
            const query = fetchQuestion.data
            const checkAnswer = await checkResult(
                sourceCode,
                query.input,
                query.output
            )
            let status = false
            if (checkAnswer.status == 2) {
                status = true
            }
            const body = {
                userId: user.data.id,
                questionId: questionId,
                result: checkAnswer.resultTest,
                status: status,
                sourceCode: sourceCode,
            }
            const post = await axios.post(`${api}/submit`, body, {
                headers: { Authorization: authHeader },
            })
            return post
        }
    } catch (err) {
        console.log(err.message)
    }
}

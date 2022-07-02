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

const backend = async ({ questionId, userId, sourceCode }, headers) => {
    const api = process.env.URL.split(',')[0]
    try {
        const authHeader = headers['authorization']
        const user = await axios.get(`${api}/users/${userId}`, {
            headers: { Authorization: authHeader },
        })
        const fetchQuestion = await axios.get(
            `${api}/question/grader/${questionId}`,
            { headers: { Authorization: authHeader } }
        )
        if (fetchQuestion.data._id && user) {
            const query = fetchQuestion.data
            const checkAnswer = await checkResult(
                sourceCode,
                query.input,
                query.output
            )
            let status = false
            let score = 0
            if (checkAnswer.status == 2) {
                status = true
                score = query.rank * 100
            }
            const body = {
                userId: userId,
                questionId: questionId,
                result: checkAnswer.resultTest,
                status: status,
                score: score,
                sourceCode: sourceCode,
            }
            const post = await axios.post(
                `${api}/submit`,
                body,
                {
                    headers: { Authorization: authHeader },
                }
            )
            return post
        }
    } catch (err) {
        console.log(err.message)
    }
}

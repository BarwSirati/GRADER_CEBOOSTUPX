const { checkResult } = require("./run");
const tress = require("tress");
const axios = require("axios");

const queue = tress((req, next) => {
  try {
    backend(req.body, req.headers).then(() => next());
  } catch (err) {
    console.log(e.message);
  }
}, 1);

exports.add_res_queue = async (req, res) => {
  try {
    queue.push(req);
    res.status(200).send("Req in queue");
  } catch (err) {
    res.status(304).send("Error sendding");
  }
};

const backend = async ({ solutionId, userId, sourceCode }, headers) => {
  try {
    const authHeader = headers["authorization"];
    const fetch = await axios.get(
      `http://localhost:3000/question/${solutionId}`,
      { headers: { Authorization: authHeader } }
    );
    const query = fetch.data[0];
    const checkAnswer = await checkResult(
      sourceCode,
      query.input,
      query.output
    );
    console.log(checkAnswer);
  } catch (err) {
    console.log(err.message);
  }
};

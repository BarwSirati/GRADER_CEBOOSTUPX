const express = require("express");
const router = express.Router();
const { add_res_queue } = require("../compiler/worker");
const auth = require("../middleware/auth");

router.get("/", (req, res, next) => {
  res.status(200).send({ msg: "WHAT ARE YOU DOING??" });
});
router.post("/", auth, (req, res, next) => {
  add_res_queue(req, res);
});
module.exports = router;

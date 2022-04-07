const express = require("express");
const app = express();
const cors = require("cors");

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ limit: "1mb", extended: false }));

app.get("/", (req, res, next) => {
  res.status(200).send({ msg: "THIS IS COMPILER FOR CEBOOSTUPX" });
});
app.use("/checkResult", require("./services/checkResult"));

module.exports = app;

const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];
  if (!token) {
    return res
      .status(403)
      .send({ msg: "WHO ARE YOU?? LEAVE HERE NOW BEFORE I CALL A POLICE" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], config.SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  next();
};

module.exports = verifyToken;

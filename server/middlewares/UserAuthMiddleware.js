//   to verify token
require("dotenv").config();
const jwt = require("jsonwebtoken");

// this middleware should correctly verify JWTs in incoming requests and extract the user's ID for further processing
module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    console.log(token, process.env.JWT_SECRET)
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          message: "Auth failed",
          success: false,
        });
      } else {
        req.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};

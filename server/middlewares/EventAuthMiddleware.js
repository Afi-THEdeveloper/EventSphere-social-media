//   to verify token
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Event = require("../models/EventModel");

// this middleware should correctly verify JWTs in incoming requests and extract the user's ID for further processing
module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    console.log(token, process.env.JWT_SECRET);
    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        return res.status(401).send({
          message: "Auth failed",
          success: false,
        });
      } else {
        req.eventId = decode.id;

        // check and clear expired plan of event
        const event = await Event.findById(req.eventId);
        const currentDate = new Date();
        console.log("selected", event?.selectedPlan);
        if (event?.selectedPlan?.transactionId) {
          if (event?.selectedPlan?.expiry < currentDate) {
            await Event.updateOne(
              { _id: req.eventId },
              { $unset: { selectedPlan: 1 } }
            );
          }
        }



        next();
      }
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};



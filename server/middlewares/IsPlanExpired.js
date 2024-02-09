const Event = require("../models/EventModel");

module.exports = async (req, res, next) => {
  try {
    const event = await Event.findById(req.eventId);
    const currentDate = new Date();
    console.log('selected',event.selectedPlan)
    if (event.selectedPlan.transactionId) {
      if (event.selectedPlan.expiry < currentDate) {
        await Event.updateOne({ _id: req.eventId }, { $unset: { selectedPlan: 1 } });
        return res.json({error:'your plan has been expired'})
      }else{
        next()
      }
    }else{
        return res.json({ error:'please subscribe to a plan'})
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", success: false });
  }
};







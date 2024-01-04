const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ChatConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref:'user'
    },
    eventId: {
      type: ObjectId,
      ref:'event'
    },
    eventImage: {
      type: String,
    },
    eventName: {
      type: String,
    },
    userName: {
      type: String,
    },
    userImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chatConnection", ChatConnectionSchema);

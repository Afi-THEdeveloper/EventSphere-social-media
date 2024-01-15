const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ChatConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref:'user',
      required: true
    },
    eventId: {
      type: ObjectId,
      ref:'event',
      required: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chatConnection", ChatConnectionSchema);

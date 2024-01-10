const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ChatMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
    },
    userId: {
      type: ObjectId,
      ref: "user",
    },
    eventId: {
      type: ObjectId,
      ref: "event",
    },
    senderId: {
      type: String,
    },
    message: {
      type: String,
    },
    time: {
      type: String,
    },
    isUserSeen:{
      type:Boolean,
      default:false,
    },
    isEventSeen:{
      type:Boolean,
      default:false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);

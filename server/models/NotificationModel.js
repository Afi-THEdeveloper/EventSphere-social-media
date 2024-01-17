const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const notificationSchema = new mongoose.Schema(
  {
    recieverId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    notificationMessage: {
      type: String,
      required: true,
    },
    actionOn: {
      model: {
        type: String,
        required: true,
      },
      objectId: {
        type: ObjectId,
        required: true,
        refPath: "$actionOn.model", // Use $actionOn.model as the ref path
      },
    },
    date: {
      type: Date,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongoose.model("notification", notificationSchema);
module.exports = notificationModel;

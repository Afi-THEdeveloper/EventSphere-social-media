const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const eventStorySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "event",
    },
    description: {
      type: String,
    },
    likes: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    expiresAt: {
      type: Date,
      default: function () {
        // Set to expire 24 hours after createdAt
        return new Date(this.createdAt.getTime() + 3 * 60 * 1000);
      },
    },
  },
  { timestamps: true }
);

const eventStoryModel = mongoose.model("stories", eventStorySchema);
module.exports = eventStoryModel;


// return new Date(this.createdAt.getTime() + 24 * 60 * 60 * 1000);  one day expire
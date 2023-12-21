const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const eventPostSchema = new mongoose.Schema(
  {
    location: {
      type: String,
    },
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
    commentsCount:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

const eventPostModel = mongoose.model("eventPosts", eventPostSchema);
module.exports = eventPostModel;

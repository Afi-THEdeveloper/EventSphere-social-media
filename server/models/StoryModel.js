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
    expiresOn: {
      type: Date,
      required: true,
    },
  },
);

const eventStoryModel = mongoose.model("stories", eventStorySchema);
module.exports = eventStoryModel;


// return new Date(this.createdAt.getTime() + 24 * 60 * 60 * 1000);  one day expire
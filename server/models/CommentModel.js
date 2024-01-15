const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: ObjectId,
      ref: "eventpost",
      required: true,
    },
    userId:{
      type: ObjectId,
      ref:'user',
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    replies: [
      {
        username: {
          type: String,
          required: true,
        },
        repliedUser:{
          type:Object,
          required: true,
        },
        commentId: {
          type: ObjectId,
          required: true,
        },
        reply: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: new Date().getTime(),
        },
      },
    ],
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("comments", commentSchema);
module.exports = CommentModel;

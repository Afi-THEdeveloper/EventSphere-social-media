const Comment = require("../../models/CommentModel");
const EventPost = require("../../models/EventPostModel");
const User = require("../../models/UserModel");
const CatchAsync = require("../../util/CatchAsync");

exports.createComment = CatchAsync(async (req, res) => {
  const id = req?.params?.postId;
  const { comment, username } = req?.body;
  if (id) {
    const createdComment = await Comment.create({
      postId: id,
      comment: comment,
      username: username ? username : "event",
      userId:req?.userId,
    });
    
    const post = await EventPost.findById(id);
    const currentCommentsCount = post ? post.commentsCount : 0;
    post.commentsCount = currentCommentsCount + 1;
    await post.save();

    return res.status(200).json({ success: "ok", createdComment });
  } else {
    res.status(404).json({ message: "post id is missing" });
  }
});

exports.getAllComments = CatchAsync(async (req, res) => {
  const id = req?.params?.postId;
  if (id) {
    const comments = await Comment.find({ postId: id }).sort({
      createdAt: "desc",
    });
    let replies = comments.map((c) => {
      return c?.replies?.length >= 0 ? c?.replies.reverse() : [];
    });

    let NewComments = [...comments, replies];
    res.json(comments);
  } else {
    res.status(404).json({ message: "comment id is not found" });
  }
});

exports.addReply = CatchAsync(async (req, res) => {
  console.log(req.params, req.body);
  const comment_Id = req?.params?.commentId;
  const user = await User.findById(req?.userId)
  console.log(user)
  if (comment_Id) {
    const reply = {
      commentId: comment_Id,
      username: req.body.username,
      repliedUser:{profile:user?.profile,id:user?._id},
      reply: req.body.reply,
    };
    const newComment = await Comment.findByIdAndUpdate(
      { _id: comment_Id },
      { $push: { replies: reply } },
      { new: true }
    );
    res.json(newComment);
  } else {
    res.status(404).json({ message: "comment id is not found" });
  }
});

exports.deleteReply = CatchAsync(async (req, res) => {
  const comment_Id = req?.params?.commentId;
  const reply_Id = req?.params?.replyId;

  if (comment_Id && reply_Id) {
    const newComment = await Comment.findByIdAndUpdate(
      { _id: comment_Id },
      { $pull: { replies: { _id: reply_Id } } },
      { new: true }
    );
    res.json(newComment);
  } else {
    res.status(404).json({ message: "comment id is not found" });
  }
});

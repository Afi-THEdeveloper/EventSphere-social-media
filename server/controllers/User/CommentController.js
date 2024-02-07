const Comment = require("../../models/CommentModel");
const EventPost = require("../../models/EventPostModel");
const User = require("../../models/UserModel");
const Notification = require("../../models/NotificationModel");
const CatchAsync = require("../../util/CatchAsync");

exports.createComment = CatchAsync(async (req, res) => {
  const { comment, id, username } = req?.body;
  if (id) {
    const createdComment = await Comment.create({
      postId: id,
      comment: comment,
      userId: req?.userId,
    });

    const post = await EventPost.findById(id);
    const currentCommentsCount = post ? post.commentsCount : 0;
    post.commentsCount = currentCommentsCount + 1;
    await post.save();

    //send notification
    const sendNotification = new Notification({
      recieverId: post.postedBy,
      senderId: req?.userId,
      notificationMessage: `${username} commented "${comment}" on your post`,
      actionOn: id,
      actionOn: {
        model: "eventPosts",
        objectId: id,
      },
      date: new Date(),
    });
    await sendNotification.save();

    return res.status(200).json({ success: "ok", createdComment });
  } else {
    res.status(404).json({ message: "post id is missing" });
  }
});

exports.getAllComments = CatchAsync(async (req, res) => {
  const id = req?.params?.postId;
  if (id) {
    const comments = await Comment.find({ postId: id })
      .sort({
        createdAt: "desc",
      })
      .populate("userId");
    let replies = comments.map((c) => {
      return c?.replies?.length >= 0 ? c?.replies.reverse() : [];
    });

    let NewComments = [...comments, replies];
    res.status(200).json({ success: true, comments });
  } else {
    res.json({ error: "comment id is not found" });
  }
});

exports.addReply = CatchAsync(async (req, res) => {
  console.log(req.body);
  const comment_Id = req?.body?.commentId;
  const user = await User.findById(req?.userId);
  console.log(user);
  if (comment_Id) {
    const reply = {
      commentId: comment_Id,
      username: req.body.username,
      repliedUser: { profile: user?.profile, id: user?._id },
      reply: req.body.reply,
    };
    const newComment = await Comment.findByIdAndUpdate(
      { _id: comment_Id },
      { $push: { replies: reply } },
      { new: true }
    );
    res.status(200).json({ success: true, newComment });
  } else {
    res.json({ error: "comment id is not found" });
  }
});

exports.deleteReply = CatchAsync(async (req, res) => {
  console.log(req?.body);
  const comment_Id = req?.body?.commentId;
  const reply_Id = req?.body?.replyId;

  if (comment_Id && reply_Id) {
    const newComment = await Comment.findByIdAndUpdate(
      { _id: comment_Id },
      { $pull: { replies: { _id: reply_Id } } },
      { new: true }
    );
    res.status(200).json({ success: true, newComment });
  } else {
    res.json({ error: "comment id is not found" });
  }
});

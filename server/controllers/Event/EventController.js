const Event = require("../../models/EventModel");
const EventPost = require("../../models/EventPostModel");
const Comment = require("../../models/CommentModel");
const Story = require("../../models/StoryModel");
const Notification = require("../../models/NotificationModel");
const ChatConnection = require("../../models/ChatConnection");
const CatchAsync = require("../../util/CatchAsync");
const bcrypt = require("bcrypt");
const randomString = require("randomstring");
const OtpMailer = require("../../util/OtpMailer");
const jwt = require("jsonwebtoken");

//hashing  password
const securePassword = async (password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  return passwordHash;
};

exports.registerEvent = CatchAsync(async (req, res) => {
  console.log(req.body);
  const isEventExists = await Event.findOne({ email: req.body.email });
  if (isEventExists) {
    return res.json({ error: "Event already exists" });
  } else {
    const secPassword = await securePassword(req.body.password);
    const newOtp = randomString.generate({
      length: 4,
      charset: "numeric",
    });
    const event = new Event({
      title: req.body.eventName,
      email: req.body.email,
      ownerName: req.body.Ownername,
      place: req.body.place,
      phone: req.body.phone,
      altPhone: req.body.altPhone,
      services: req.body.services,
      officeAddress: req.body.officeAddress,
      password: secPassword,
      otp: { code: newOtp, generatedAt: Date.now() },
    });
    const eventData = await event.save();

    if (eventData) {
      const options = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "EventSphere verification otp",
        html: `<center> <h2>Verify Your Email </h2> <br> <h5>OTP :${newOtp} </h5><br><p>This otp is only valid for 1 minutes only</p></center>`,
      };
      await OtpMailer.sendMail(options)
        .then((res) => console.log("otp sended"))
        .catch((err) => console.log(err.message));
      return res.status(200).json({ success: "ok", email: req.body.email });
    } else {
      res.status(404).json({ error: "user registration failed" });
    }
  }
});

exports.verifyEventOtp = CatchAsync(async (req, res) => {
  const { otp, email } = req.body;
  const event = await Event.findOne({ email: email });
  const generatedAt = new Date(event.otp.generatedAt).getTime();
  if (Date.now() - generatedAt <= 30 * 1000) {
    if (otp === event.otp.code) {
      event.isVerified = true;
      event.otp.code = "";
      await event.save();
      return res.status(200).json({ success: "event registered successfully" });
    } else {
      return res.json({ error: "otp is invalid" });
    }
  } else {
    return res.json({ error: "otp expired" });
  }
});

exports.ResendOtpEvent = CatchAsync(async (req, res) => {
  console.log(req.body);
  if (!req.body.email) {
    return console.log("email missing");
  }
  const event = await Event.findOne({ email: req.body.email });
  const newOtp = randomString.generate({
    length: 4,
    charset: "numeric",
  });
  const options = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "EventSphere verification otp for Event",
    html: `<center> <h2>Verify Your Email </h2> <br> <h5>OTP :${newOtp} </h5><br><p>This otp is only valid for 1 minutes only</p></center>`,
  };
  await OtpMailer.sendMail(options)
    .then((res) => console.log("otp sended"))
    .catch((err) => console.log(err.message));

  event.otp.code = newOtp;
  event.otp.generatedAt = Date.now();
  await event.save();
  return res
    .status(200)
    .json({ success: "Otp Resended", email: req.body.email });
});

exports.verifyEventLogin = CatchAsync(async (req, res) => {
  console.log(req.body);
  const event = await Event.findOne({ email: req.body.email });
  if (!event) {
    return res.json({ error: "event not found" });
  }
  const isMatch = await bcrypt.compare(req.body.password, event.password);
  if (!isMatch) {
    return res.status(200).json({ error: "password is not matching" });
  }

  if (event.isBlocked) {
    return res.status(200).json({ error: "Sorry, event is blocked by admin" });
  }

  if (!event.isVerified) {
    await Event.findOneAndDelete({ email: req.body.email });
    return res
      .status(200)
      .json({ error: "Event Account Not Verified SignUp Again" });
  }

  const token = jwt.sign({ id: event._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  event.password = "";
  res.status(200).json({ success: "Login successful", token, event });
});

exports.updateEvent = CatchAsync(async (req, res) => {
  const { title, ownerName, place, services, officeAddress, phone, altPhone } =
    req.body;
  const updatedEvent = await Event.findByIdAndUpdate(
    { _id: req.eventId },
    {
      $set: {
        title,
        ownerName,
        place,
        officeAddress,
        services,
        phone,
        altPhone,
      },
    },
    { new: true }
  );

  if (updatedEvent) {
    return res
      .status(200)
      .json({ success: "event updated successfully", event: updatedEvent });
  }

  return res.json({ error: "event updation failed, try again" });
});

exports.updateEventProfile = CatchAsync(async (req, res) => {
  const event = await Event.findById(req.eventId);
  event.profile = req.body?.profile;
  await event.save();
  await ChatConnection.updateMany(
    { eventId: req?.eventId },
    { $set: { eventImage: req?.body?.profile } }
  );
  return res
    .status(200)
    .json({ success: "profile updated successfully", event });
});

exports.getPostComments = CatchAsync(async (req, res) => {
  const id = req?.body?.postId;
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
    console.log(comments);
    return res.status(200).json({ success: "ok", comments });
  } else {
    res.json({ error: "POST id is not found" });
  }
});

exports.EventReply = CatchAsync(async (req, res) => {
  console.log(req.body);
  const comment_Id = req?.body?.commentId;
  const id = req?.body?.postId;
  const event = await Event.findById(req?.eventId);
  console.log(event);
  if (comment_Id) {
    const reply = {
      commentId: comment_Id,
      username: event.title,
      repliedUser: { profile: event?.profile, id: event?._id },
      reply: req.body?.reply,
    };
    const repliedComment = await Comment.findByIdAndUpdate(
      { _id: comment_Id },
      { $push: { replies: reply } },
      { new: true }
    );
    const comments = await Comment.find({ postId: id })
      .sort({
        createdAt: "desc",
      })
      .populate("userId");
    let replies = comments.map((c) => {
      return c?.replies?.length >= 0 ? c?.replies.reverse() : [];
    });

    let NewComments = [...comments, replies];
    console.log(comments);

    const sendNotification = new Notification({
      recieverId: repliedComment?.userId,
      senderId: event._id,
      notificationMessage: `${repliedComment?.username} replied "${req.body?.reply}" to your comment "${repliedComment?.comment}"`,
      date: new Date(),
    });
    await sendNotification.save();

    return res.status(200).json({ success: "ok", comments });
  } else {
    res.json({ message: "comment id is not found" });
  }
});

exports.deleteReply = CatchAsync(async (req, res) => {
  const comment_Id = req?.body?.commentId;
  const reply_Id = req?.body?.replyId;

  if (comment_Id && reply_Id) {
    const newComment = await Comment.findByIdAndUpdate(
      { _id: comment_Id },
      { $pull: { replies: { _id: reply_Id } } },
      { new: true }
    );

    return res.status(200).json({ success: "ok" });
  } else {
    res.json({ message: "comment id is not found" });
  }
});

exports.addPost = CatchAsync(async (req, res) => {
  console.log(req.body);
  const event = await Event.findById(req.eventId);
  let data = {};

  if (req.body.image) {
    data.image = req.body.image;
  } else {
    return res.json({ error: "post image is missing" });
  }

  if (req.body.location) data.location = req.body.location;
  if (req.body.description) data.description = req.body.description;

  data.postedBy = event._id;
  console.log(data);
  const post = new EventPost(data);
  await post.save();
  return res.status(200).json({ success: "posted Successfully", event });
});

exports.deletePost = CatchAsync(async (req, res) => {
  await EventPost.findByIdAndDelete({ _id: req.body.id });
  return res.status(200).json({ success: "post deleted" });
});

exports.addStory = CatchAsync(async (req, res) => {
  const event = await Event.findById(req.eventId);
  let data = {};

  if (req.body.image) {
    data.image = req.body.image;
  } else {
    return res.json({ error: "post image is missing" });
  }

  if (req.body.description) data.description = req.body.description;
  const createdAt = new Date();

  data.postedBy = event._id;
  data.expiresOn = new Date(createdAt.getTime() + 3 * 60 * 1000); // 3 mins valid
  console.log(data);
  const story = new Story(data);
  await story.save();
  return res.status(200).json({ success: "story Added Successfully", story });
});

exports.getEventPosts = CatchAsync(async (req, res) => {
  const posts = await EventPost.find({ postedBy: req?.body?.eventId }).sort({
    createdAt: -1,
  });
  console.log("posts", posts);
  if (posts) {
    return res.status(200).json({ success: "ok", posts });
  } else {
    return res.status(200).json({ error: "failed to fetch posts" });
  }
});

exports.getEventStory = CatchAsync(async (req, res) => {
  console.log(req?.body?.eventId);
  const event = await Event.findById(req?.body?.eventId);
  console.log(event);
  const currentDate = new Date();
  const deleted = await Story.deleteMany({ expiresOn: { $lt: currentDate } });
  console.log("deleted", deleted);
  const stories = await Story.find({ postedBy: event._id });
  console.log("stories", stories);
  return res.status(200).json({ success: "ok", stories });
});

// notifications

exports.getNotificationsCount = CatchAsync(async (req, res) => {
  const count = await Notification.countDocuments({
    recieverId: req?.eventId,
    seen: false,
  });
  return res.status(200).json({ success: true, count });
});

exports.getNotifications = CatchAsync(async (req, res) => {
  await Notification.updateMany(
    { recieverId: req?.eventId, seen: false },
    { $set: { seen: true } }
  );
  const notifications = await Notification.find({
    recieverId: req?.eventId,
    seen: true,
  })
    .sort({ date: -1 })
    .populate("actionOn");
  console.log(notifications);
  return res.status(200).json({ success: true, notifications });
});

exports.clearNotification = CatchAsync(async (req, res) => {
  const Id = req.body?.NotId;
  await Notification.findByIdAndDelete(Id);
  res.status(200).send({ success: true });
});

exports.clearAllNotifications = CatchAsync(async (req, res) => {
  await Notification.deleteMany({ recieverId: req?.eventId, seen: true });
  res.status(200).send({ success: "cleared All" });
});

exports.getFollowers = CatchAsync(async (req, res) => {
  const event = await Event.findById(req?.eventId).populate("followers");
  if (event) {
    return res.status(200).json({ success: true, followers: event?.followers });
  } else {
    return res.json({ error: "failed to find followers,try again" });
  }
});

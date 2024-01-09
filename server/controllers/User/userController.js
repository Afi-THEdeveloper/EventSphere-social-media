const User = require("../../models/UserModel");
const EventPost = require("../../models/EventPostModel");
const Event = require("../../models/EventModel");
const Story = require("../../models/StoryModel");
const Notification = require("../../models/NotificationModel");
const ChatConnection = require("../../models/ChatConnection");
const randomString = require("randomstring");
const OtpMailer = require("../../util/OtpMailer");
const CatchAsync = require("../../util/CatchAsync");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//hashing  password
const securePassword = async (password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  return passwordHash;
};

exports.register = CatchAsync(async (req, res) => {
  console.log(req.body);
  const isUserExists = await User.findOne({ email: req.body.email });
  if (isUserExists) {
    return res.json({ error: "user already exists" });
  } else {
    const secPassword = await securePassword(req.body.password);
    const newOtp = randomString.generate({
      length: 4,
      charset: "numeric",
    });
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: secPassword,
      otp: { code: newOtp, generatedAt: Date.now() },
    });
    const userData = await user.save();

    if (userData) {
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

exports.loginUser = CatchAsync(async (req, res) => {
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({ error: "user not found" });
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return res.status(200).json({ error: "password is not matching" });
  }

  if (user.isBlocked) {
    return res.status(200).json({ error: "Sorry, you are blocked by admin" });
  }

  if (!user.isVerified) {
    await User.findOneAndDelete({ email: req.body.email });
    return res.status(200).json({ error: "Account Not Verified SignUp Again" });
  }

  const token = jwt.sign({ id: user._id, user }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  user.password = "";
  res.status(200).json({ success: "Login successful", token, user });
});

exports.VerifyOtp = CatchAsync(async (req, res) => {
  const { otp, email } = req.body;
  const user = await User.findOne({ email: email });
  const generatedAt = new Date(user.otp.generatedAt).getTime();
  console.log(Date.now());
  console.log(generatedAt);
  if (Date.now() - generatedAt <= 30 * 1000) {
    if (otp === user.otp.code) {
      user.isVerified = true;
      user.otp.code = "";
      await user.save();
      return res.status(200).json({ success: "user registered successfully" });
    } else {
      return res.json({ error: "otp is invalid" });
    }
  } else {
    return res.json({ error: "otp expired" });
  }
});

exports.ResendOtp = CatchAsync(async (req, res) => {
  console.log(req.body);
  if (!req.body.email) {
    return console.log("email missing");
  }
  const user = await User.findOne({ email: req.body.email });
  const newOtp = randomString.generate({
    length: 4,
    charset: "numeric",
  });
  const options = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "EventSphere verification otp for User",
    html: `<center> <h2>Verify Your Email </h2> <br> <h5>OTP :${newOtp} </h5><br><p>This otp is only valid for 1 minutes only</p></center>`,
  };
  await OtpMailer.sendMail(options)
    .then((res) => console.log("otp sended"))
    .catch((err) => console.log(err.message));

  user.otp.code = newOtp;
  user.otp.generatedAt = Date.now();
  await user.save();
  return res
    .status(200)
    .json({ success: "Otp Resended", email: req.body.email });
});

exports.getFollowingposts = CatchAsync(async (req, res) => {
  const user = await User.findById(req?.userId);
  const followingEventIds = user.following;
  console.log(followingEventIds);
  const posts = await EventPost.find({ postedBy: { $in: followingEventIds } })
    .sort({ createdAt: -1 })
    .populate("postedBy");
  return res.status(200).json({ success: "ok", posts });
});

exports.getEventPosts = CatchAsync(async (req, res) => {
  const posts = await EventPost.find({})
    .sort({ createdAt: -1 })
    .populate("postedBy");
  return res.status(200).json({ success: "ok", posts });
});

exports.likePost = CatchAsync(async (req, res) => {
  const likedPost = await EventPost.findByIdAndUpdate(
    req.body.postId,

    { $push: { likes: req.userId } },
    { new: true }
  );
  if (likedPost) {
    const user = await User.findById(req?.userId);
    const sendNotification = new Notification({
      recieverId: likedPost.postedBy,
      senderId: user._id,
      notificationMessage: `${user?.username} liked you post`,
      actionOn: likedPost?._id,
      date: new Date(),
    });
    await sendNotification.save();
    return res.status(200).json({ success: "ok", post: likedPost });
  }
  return res.json({ error: "failed to like,try again" });
});

exports.UnlikePost = CatchAsync(async (req, res) => {
  const UnlikedPost = await EventPost.findByIdAndUpdate(
    req.body.postId,

    { $pull: { likes: req.userId } },
    { new: true }
  );
  if (UnlikedPost) {
    return res.status(200).json({ success: "ok", post: UnlikedPost });
  }
  return res.json({ error: "failed to like,try again" });
});

exports.followEvent = CatchAsync(async (req, res) => {
  const eventId = req?.body?.eventId;
  if (eventId) {
    const user = await User.findById(req.userId);
    const event = await Event.findById(eventId);
    event.followers.push(user?._id);
    user.following.push(event?._id);
    await event.save();
    await user.save();

    const sendNotification = new Notification({
      recieverId: eventId,
      senderId: user._id,
      notificationMessage: `${user?.username} started following you`,
      date: new Date(),
    });
    await sendNotification.save();
    return res.status(200).json({ success: "ok", event, user });
  } else {
    return res.json({ error: "event id not found" });
  }
});

exports.unfollowEvent = CatchAsync(async (req, res) => {
  const eventId = req?.body?.eventId;
  if (eventId) {
    const userUnfollowed = await User.findByIdAndUpdate(
      req?.userId,

      { $pull: { following: eventId } },
      { new: true }
    );
    const unfollowedEvent = await Event.findByIdAndUpdate(
      eventId,

      { $pull: { followers: req?.userId } },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: "ok", event: unfollowedEvent, user: userUnfollowed });
  } else {
    return res.json({ error: "event id not found" });
  }
});

exports.getStories = CatchAsync(async (req, res) => {
  const currentDate = new Date();
  const deleted = await Story.deleteMany({ expiresOn: { $lt: currentDate } });
  console.log("expired stories", deleted);
  const stories = await Story.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    {
      $lookup: {
        from: "events",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedByDetails",
      },
    },
    {
      $unwind: "$postedByDetails",
    },
    {
      $group: {
        _id: "$postedBy",
        stories: { $push: "$$ROOT" }, // Add each document to the 'stories' array
      },
    },
    {
      $project: {
        _id: 0, // Exclude the default '_id' field
        postedBy: "$_id", // Rename '_id' to 'postedBy'
        stories: 1, // Include the 'stories' field
      },
    },
  ]);

  console.log("userSide", stories[0]?.stories);
  return res.status(200).json({ success: "ok", stories });
});

exports.editUser = CatchAsync(async (req, res) => {
  console.log(req.body);
  const user = await User.findById(req?.userId);
  if (user) {
    user.username = req?.body?.username;
    user.phone = req?.body?.phone;
    user.profile = req?.body?.profile;
    await user.save();

    await ChatConnection.updateMany(
      { userId: req?.userId },
      { $set: { userImage: req?.body?.profile } }
    );
    return res.status(200).json({ success: "profile updated", user });
  } else {
    return res.json({ error: "user not found" });
  }
});

exports.addJobProfile = CatchAsync(async (req, res) => {
  console.log(req.file);
  console.log(req.body);
  const user = await User.findById(req?.userId);
  if (user) {
    user.jobProfile = user.jobProfile || {};

    user.jobProfile.fullName = req?.body?.fullName;
    user.jobProfile.phone = req?.body?.phone;
    user.jobProfile.skills = req?.body?.skills;
    user.jobProfile.jobRole = req?.body?.jobRole;
    user.jobProfile.yearOfExperience = req?.body?.yearOfExperience;
    user.jobProfile.CV = req?.file?.filename;
    user.isJobSeeker = true;
    await user.save();
    return res.status(200).json({ success: "job profile added", user });
  } else {
    return res.json({ erroe: "user not found" });
  }
});

exports.updateJobProfile = CatchAsync(async (req, res) => {
  console.log(req.file);
  console.log(req.body);
  const user = await User.findById(req?.userId);
  if (user) {
    user.jobProfile = user.jobProfile || {};

    user.jobProfile.fullName = req?.body?.fullName;
    user.jobProfile.phone = req?.body?.phone;
    user.jobProfile.skills = req?.body?.skills;
    user.jobProfile.jobRole = req?.body?.jobRole;
    user.jobProfile.yearOfExperience = req?.body?.yearOfExperience;
    user.jobProfile.CV = req?.file?.filename;
    user.isJobSeeker = true;
    await user.save();
    return res.status(200).json({ success: "job profile added", user });
  } else {
    return res.json({ erroe: "user not found" });
  }
});

exports.getEvents = CatchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 4;
  console.log(page, pageSize);
  const totalEvents = await Event.countDocuments({ isBlocked: false });
  const totalPages = Math.ceil(totalEvents / pageSize);

  const events = await Event.find({ isBlocked: false })
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return res.status(200).json({
    success: "ok",
    events,
    currentPage: page,
    totalPages,
  });
});

// notifications
exports.getUserNotificationsCount = CatchAsync(async (req, res) => {
  const count = await Notification.countDocuments({
    recieverId: req?.userId,
    seen: false,
  });
  return res.status(200).json({ success: true, count });
});

exports.getUserNotifications = CatchAsync(async (req, res) => {
  await Notification.updateMany(
    { recieverId: req?.userId, seen: false },
    { $set: { seen: true } }
  );
  const notifications = await Notification.find({
    recieverId: req?.userId,
    seen: true,
  })
    .sort({ date: -1 })
    .populate("actionOn");
  console.log(notifications);
  return res.status(200).json({ success: true, notifications });
});

exports.clearUserNotification = CatchAsync(async (req, res) => {
  const Id = req.body?.NotId;
  await Notification.findByIdAndDelete(Id);
  res.status(200).send({ success: true });
});

exports.clearAllUserNotifications = CatchAsync(async (req, res) => {
  await Notification.deleteMany({ recieverId: req?.userId, seen: true });
  res.status(200).send({ success: "cleared All" });
});

exports.getFollowings = CatchAsync(async (req, res) => {
  const user = await User.findById(req?.userId).populate("following");
  if (user) {
    return res.status(200).json({ success: true, followings: user?.following });
  } else {
    return res.json({ error: "failed to fetch following evnets, try again" });
  }
});

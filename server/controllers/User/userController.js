const User = require("../../models/UserModel");
const EventPost = require("../../models/EventPostModel");
const Event = require("../../models/EventModel");
const Story = require("../../models/StoryModel");
const Notification = require("../../models/NotificationModel");
const Chats = require("../../models/ChatsModel");
const ChatConnection = require("../../models/ChatConnection");
const JobPost = require("../../models/JobPostModel");
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
  const page = parseInt(req.query.page) || 1;
  const pageSize = 3;
  console.log(page, pageSize);
  const user = await User.findById(req?.userId);
  const followingEventIds = user.following;
  console.log(followingEventIds);
  const totalPosts = await EventPost.find({
    postedBy: { $in: followingEventIds },
  }).countDocuments();
  console.log("totalPosts", totalPosts);
  const totalPages = Math.ceil(totalPosts / pageSize);

  const posts = await EventPost.find({ postedBy: { $in: followingEventIds } })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate("postedBy");
  return res
    .status(200)
    .json({ success: "ok", posts, currentPage: page, totalPosts });
});

exports.getEventPosts = CatchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 3;
  console.log(page, pageSize);
  const totalPosts = await EventPost.find({}).countDocuments();
  console.log("totalPosts", totalPosts);
  const totalPages = Math.ceil(totalPosts / pageSize);
  const posts = await EventPost.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate("postedBy");
  return res
    .status(200)
    .json({ success: "ok", posts, currentPage: page, totalPosts });
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
      actionOn: {
        model: "eventPosts",
        objectId: likedPost._id,
      },
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
      actionOn: {
        model: "user",
        objectId: req?.userId,
      },
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

  console.log("userSide stories", stories[0]?.stories);
  return res.status(200).json({ success: "ok", stories });
});

exports.getEventPostsinUser = CatchAsync(async (req, res) => {
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

exports.getEventStoryinUser = CatchAsync(async (req, res) => {
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

exports.editUser = CatchAsync(async (req, res) => {
  console.log(req.body);
  const user = await User.findById(req?.userId);
  if (user) {
    user.username = req?.body?.username;
    user.phone = req?.body?.phone;
    user.profile = req?.body?.profile;
    await user.save();

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
  const MsgCount = await Chats.countDocuments({
    userId: req?.userId,
    isUserSeen: false,
  });
  return res.status(200).json({ success: true, count, MsgCount });
});

exports.getUserNotifications = CatchAsync(async (req, res) => {
  await Notification.updateMany(
    { recieverId: req?.userId, seen: false },
    { $set: { seen: true } }
  );
  const notifications = await Notification.find({
    recieverId: req?.userId,
    seen: true,
  }).sort({ date: -1 });

  for (const notification of notifications) {
    await notification.populate({
      path: "actionOn.objectId",
      model: notification.actionOn.model, // Use the dynamic model name
    });
  }
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

//jobs
exports.getJobs = CatchAsync(async (req, res) => {
  const user = await User.findById(req?.userId);
  const posts = await JobPost.find({
    isBlocked: false,
    vaccancies: { $gt: 0 },
    eventId: { $in: user?.following },
    appliedUsers: { $nin: req?.userId },
    acceptedUsers: { $nin: req?.userId },
  })
    .populate("eventId")
    .sort({
      createdAt: -1,
    });
  // console.log(posts);
  return res.status(200).json({ success: true, posts });
});

exports.applyJob = CatchAsync(async (req, res) => {
  const post = await JobPost.findById(req?.body?.jobId);
  post.appliedUsers.push(req?.userId);
  post.vaccancies--;
  await post.save();

  const user = await User.findById(req?.userId);
  const sendNotification = new Notification({
    recieverId: post?.eventId,
    senderId: req?.userId,
    notificationMessage: `${user?.username} applied for the  ${post?.title} job`,
    actionOn: {
      model: "jobPost",
      objectId: post._id,
    },
    date: new Date(),
  });
  await sendNotification.save();
  return res.status(200).json({ success: "applied" });
});

exports.getJobStats = CatchAsync(async (req, res) => {
  const appliedJobs = await JobPost.find({
    appliedUsers: { $in: req?.userId },
  }).populate("eventId");
  const invites = await JobPost.find({
    acceptedUsers: { $in: req?.userId },
  }).populate("eventId");
  const stats = [
    {
      label: "Applied Jobs",
      data: appliedJobs,
    },
    {
      label: "Invites",
      data: invites,
    },
  ];
  console.log("appliedJobs", appliedJobs, invites);
  if (stats) {
    return res.status(200).json({ success: true, stats });
  } else {
    return res.json({ error: "failed to fetch job stats,try again" });
  }
});

exports.UserSearchJob = CatchAsync(async (req, res) => {
  const searched = req?.body?.searched;
  const regexPattern = new RegExp(searched, "i");

  console.log("Search Term:", searched);
  console.log("Event ID:", req?.eventId);
  const user = await User.findById(req?.userId);
  const results = await JobPost.find({
    $and: [
      {
        $or: [
          { title: { $regex: regexPattern } },
          { location: { $regex: regexPattern } },
        ],
      },
      { isBlocked: false },
      { vaccancies: { $gt: 0 } },
      { eventId: { $in: user?.following } },
      { appliedUsers: { $nin: req?.userId } },
      { acceptedUsers: { $nin: req?.userId } },
    ],
  });

  console.log("Search Results:", results);

  if (results.length) {
    res.status(200).json({
      success: true,
      results,
    });
  } else {
    res.status(200).json({
      error: "no results found",
    });
  }
});

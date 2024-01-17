const Admin = require("../../models/AdminModel");
const User = require("../../models/UserModel");
const Plan = require("../../models/PlanModel");
const Event = require("../../models/EventModel");
const PurchaseHistory = require("../../models/PurchaseHistory");
const Banner = require("../../models/BannerModel");
const CatchAsync = require("../../util/CatchAsync");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const securePassword = async (password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  return passwordHash;
};

exports.verifyAdminLogin = CatchAsync(async (req, res) => {
  const { email, password } = req.body;
  //   const secPassword = await securePassword(req.body.password);
  const admin = await Admin.findOne({ email });

  if (admin) {
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (passwordMatch) {
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res
        .status(200)
        .json({ success: "Login successfull", token, admin });
    } else {
      return res.status(200).json({ error: "Incorrect password" });
    }
  } else {
    return res.status(200).json({ error: "email not found" });
  }
});

exports.getUsers = CatchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 3;
  console.log(page, pageSize);
  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / pageSize);

  const users = await User.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return res.status(200).json({
    success: "ok",
    users,
    currentPage: page,
    totalPages,
  });
});

exports.blockUser = CatchAsync(async (req, res) => {
  console.log("hy");
  if (req.body.id) {
    const user = await User.findById(req.body.id);
    const blockUser = await User.findByIdAndUpdate(
      { _id: req.body.id },
      { $set: { isBlocked: !user.isBlocked } },
      { new: true }
    );
    if (blockUser.isBlocked) {
      return res
        .status(200)
        .json({ success: `${blockUser.username} is blocked` });
    } else {
      return res
        .status(200)
        .json({ success: `${blockUser.username} is unblocked` });
    }
  } else {
    res.status(400).json({ error: "credentials missing,failed to updated" });
  }
});

exports.getPlans = CatchAsync(async (req, res) => {
  const plans = await Plan.find({});
  return res.status(200).json({ success: "ok", plans });
});

exports.blockPlan = CatchAsync(async (req, res) => {
  console.log(req.body);
  const plan = await Plan.findById(req.body.id);
  console.log(plan);
  plan.isDeleted = !plan.isDeleted;
  await plan.save();
  if (plan.isDeleted) {
    return res.status(200).json({ success: `${plan.name} is blocked` });
  } else {
    return res.status(200).json({ success: `${plan.name} is unblocked` });
  }
});

exports.addPlan = CatchAsync(async (req, res) => {
  console.log(req.body);
  const { name, amount, description, duration } = req.body;
  // const samePlan = await Plan.findOne({ name: new RegExp(name, "i") });

  let totalDays;
  if (name === "weekly") {
    totalDays = duration * 7;
  } else if (name === "monthly") {
    totalDays = duration * 28;
  } else {
    totalDays = duration * 365;
  }

  const samePlan = await Plan.findOne({ totalDays: totalDays });
  if (samePlan) {
    return res.json({ error: "plan already exists" });
  }

  const newPlan = new Plan({
    name,
    amount,
    duration,
    description,
    totalDays,
  });
  await newPlan.save();
  res.status(200).json({ success: `${newPlan.name} added successfully` });
});

exports.editPlan = CatchAsync(async (req, res) => {
  const { name, amount, description, id, duration } = req.body;
  const plan = await Plan.findById(id);

  let totalDays;
  if (name === "weekly") {
    totalDays = duration * 7;
  } else if (name === "monthly") {
    totalDays = duration * 28;
  } else {
    totalDays = duration * 365;
  }

  const duplicatePlans = await Plan.findOne({
    $and: [
      { totalDays: totalDays }, // The total days you want to check for duplicates
      { totalDays: { $ne: plan.totalDays } }, // Exclude the current plan's total days
    ],
  });

  if (duplicatePlans) {
    return res.json({ error: "plan name already exists" });
  }
  const updatedPlan = await Plan.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        name,
        duration,
        amount,
        description,
        totalDays,
      },
    },
    { new: true }
  );
  if (updatedPlan) {
    return res
      .status(200)
      .json({ success: `${name} plan updated successfully` });
  } else {
    return res.json({ error: "updating failed" });
  }
});

exports.getEvents = CatchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 3;
  console.log(page, pageSize);
  const totalEvents = await Event.countDocuments();
  const totalPages = Math.ceil(totalEvents / pageSize);

  const events = await Event.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return res.status(200).json({
    success: "ok",
    events,
    currentPage: page,
    totalPages,
  });
});

exports.blockEvent = CatchAsync(async (req, res) => {
  console.log(req.body);
  const event = await Event.findById(req.body.id);
  console.log(event);
  event.isBlocked = !event.isBlocked;
  await event.save();
  if (event.isBlocked) {
    return res.status(200).json({ success: `${event.title} is blocked` });
  } else {
    return res.status(200).json({ success: `${event.title} is unblocked` });
  }
});

exports.getSubscriptionHistory = CatchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 6;
  const totalDocs = await PurchaseHistory.countDocuments();
  const totalPages = Math.ceil(totalDocs / pageSize);

  const histories = await PurchaseHistory.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate("event plan");
  console.log("histories", histories);

  return res.status(200).json({
    success: "ok",
    payments: histories,
    currentPage: page,
    totalPages,
  });
});

// banners

exports.getBanners = CatchAsync(async (req, res) => {
  const banners = await Banner.find({});
  // console.log('get banner', banners);
  return res.status(200).json({ success: "ok", banners });
});

exports.getClientBanners = CatchAsync(async (req, res) => {
  const banners = await Banner.find({ isBlocked: false });
  // console.log('get banner', banners);
  return res.status(200).json({ success: "ok", banners });
});

exports.addBanner = CatchAsync(async (req, res) => {
  console.log(req?.body);
  const newBanner = new Banner({
    title: req.body?.title,
    image: req?.body?.image,
    description: req?.body?.description || "",
  });
  await newBanner.save();
  if (newBanner) {
    return res.status(200).json({ success: `banner added` });
  } else {
    return res.json({ error: `failed to add banner, try again` });
  }
});

exports.updateBanner = CatchAsync(async (req, res) => {
  console.log(req?.body);
  const { bannerId, description, title, image } = req?.body;
  const updateBanner = await Banner.findByIdAndUpdate(
    bannerId,
    {
      $set: {
        title,
        description,
        image,
      },
    },
    { new: true }
  );

  if (updateBanner) {
    return res.status(200).json({ success: `banner updated` });
  } else {
    return res.json({ error: `failed to update banner, try again` });
  }
});

exports.blockBanner = CatchAsync(async (req, res) => {
  console.log(req.body);
  const banner = await Banner.findById(req.body.id);
  console.log(banner);
  banner.isBlocked = !banner.isBlocked;
  await banner.save();
  if (banner.isBlocked) {
    return res.status(200).json({ success: `banner is DeActivated` });
  } else {
    return res.status(200).json({ success: `banner is Activated` });
  }
});

//dashboard

exports.getDashboardDetails = CatchAsync(async (req, res) => {
  // Calculate daily, weekly, and monthly date ranges
  const currentDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  const oneWeek = 7 * oneDay;
  const oneMonth = 30 * oneDay;

  const startDateDaily = new Date(currentDate - oneDay);
  const startDateWeekly = new Date(currentDate - oneWeek);
  const startDateMonthly = new Date(currentDate - oneMonth);

  // Function to calculate the total amount from subscriptions
  const calculateTotalAmount = async (startDate) => {
    const subscriptions = await PurchaseHistory.find({
      startDate: { $gte: startDate, $lte: currentDate },
    }).populate("plan");

    let totalAmount = 0;

    subscriptions.forEach((subscription) => {
      totalAmount += subscription?.plan?.amount; // Assuming your plan model has an 'amount' field
    });

    return totalAmount;
  };

  // Get counts for users, artists, and subscribed artists
  const users = await User.find({}).countDocuments();
  const events = await Event.find({}).countDocuments();
  const subscribedEvents = await Event.find({
    "selectedPlan.transactionId": { $ne: undefined },
  }).countDocuments();

  // Calculate total amounts for daily, weekly, and monthly subscriptions
  const dailyAmount = await calculateTotalAmount(startDateDaily);
  const weeklyAmount = await calculateTotalAmount(startDateWeekly);
  const monthlyAmount = await calculateTotalAmount(startDateMonthly);

  return res.status(200).json({
    success: "ok",
    users,
    events,
    subscribedEvents,
    dailyAmount,
    weeklyAmount,
    monthlyAmount,
  });
});

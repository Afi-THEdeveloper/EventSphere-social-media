const Admin = require("../../models/AdminModel");
const User = require("../../models/UserModel");
const Plan = require("../../models/PlanModel");
const Event = require("../../models/EventModel");
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
  const pageSize = 2;
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
  const samePlan = await Plan.findOne({ name: new RegExp(name, "i") });
  if (samePlan) {
    return res.json({ error: "plan already exists" });
  }

  const newPlan = new Plan({
    name,
    amount,
    duration,
    description,
  });
  await newPlan.save();
  res.status(200).json({ success: `${newPlan.name} added successfully` });
});

exports.editPlan = CatchAsync(async (req, res) => {
  const { name, amount, description, id, duration } = req.body;
  const plan = await Plan.findById(id);
  const duplicatePlans = await Plan.find({
    name: { $ne: plan.name, $regex: new RegExp("^" + name + "$", "i") },
  });
  console.log(duplicatePlans);

  if (duplicatePlans.length) {
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
      },
    }
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
  const pageSize = 1;
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

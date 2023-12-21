const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controllers/Admin/AdminController");
const AdminAuth = require("../middlewares/AdminAuthMiddleware");

adminRouter
  .post("/verifyAdmin", adminController.verifyAdminLogin)
  .get("/getUsers", AdminAuth, adminController.getUsers)
  .post("/blockUser", AdminAuth, adminController.blockUser)
  .get("/getPlans", AdminAuth, adminController.getPlans)
  .post("/blockPlan", AdminAuth, adminController.blockPlan)
  .post("/addPlan", AdminAuth, adminController.addPlan)
  .post("/editPlan", AdminAuth, adminController.editPlan)
  .get("/getEvents", AdminAuth, adminController.getEvents)
  .post("/blockEvent", AdminAuth, adminController.blockEvent);

module.exports = adminRouter;

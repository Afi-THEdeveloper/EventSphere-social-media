const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controllers/Admin/AdminController");
const {uploadBanner,resizeBanner} = require("../middlewares/imgUploads")
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
  .post("/blockEvent", AdminAuth, adminController.blockEvent)
  .get('/getSubscriptionHistory', AdminAuth, adminController.getSubscriptionHistory)
  .get('/getBanners', AdminAuth, adminController.getBanners)
  .get('/getClientBanners', AdminAuth, adminController.getClientBanners)
  .post('/addBanner', AdminAuth, uploadBanner, resizeBanner,  adminController.addBanner)
  .put('/updateBanner', AdminAuth, uploadBanner, resizeBanner,  adminController.updateBanner)
  .patch('/blockBanner', AdminAuth, adminController.blockBanner)
  .get('/getDashboardDetails', AdminAuth, adminController.getDashboardDetails)

module.exports = adminRouter;

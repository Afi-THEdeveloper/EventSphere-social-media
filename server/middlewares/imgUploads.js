const multer = require("multer");
const sharp = require("sharp");
const Event = require("../models/EventModel");
const User = require("../models/UserModel");
const Admin = require("../models/AdminModel");
const fs = require("fs").promises;

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image !, Please upload only Images", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//post image
exports.uploadEventPost = upload.single("post");
exports.processEventPost = async (req, res, next) => {
  const event = await Event.findById(req.eventId);
  try {
    if (!req.file) return next();
    req.file.filename = `event-${event.email}-${Date.now()}.jpeg`;
    req.body.image = req.file.filename;

    await sharp(req.file.buffer)
      .resize(1080, 1080)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/assets/Event/posts/${req.file.filename}`);

    next();
  } catch (error) {
    res.json({ error: "Error in processing file" });
    console.error(error.message);
  }
};

//profile image
exports.uploadEventProfile = upload.single("profile");
exports.resizeEventProfile = async (req, res, next) => {
  const event = await Event.findById(req.eventId);
  try {
    if (!req.file) return next();
    req.file.filename = `event-${event.email}-${Date.now()}.jpeg`;
    req.body.profile = req.file.filename;
    await sharp(req.file.buffer)
      .resize(1080, 1080)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/assets/profiles/${req.file.filename}`);
    next();
  } catch (error) {
    res.json({ error: "error in resizing image" });
    console.log(error.message);
  }
};

//user profile

exports.uploadUserProfile = upload.single("profile");
exports.resizeUserProfile = async (req, res, next) => {
  const user = await User.findById(req.userId);
  try {
    if (!req.file) return next();
    req.file.filename = `event-${user.email}-${Date.now()}.jpeg`;
    req.body.profile = req.file.filename;
    await sharp(req.file.buffer)
      .resize(1080, 1080)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/assets/profiles/${req.file.filename}`);
    next();
  } catch (error) {
    res.json({ error: "error in resizing image" });
    console.log(error.message);
  }
};

//pdf upload
const Pdfstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/assets/files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const PdfUpload = multer({ storage: Pdfstorage });

exports.uploadCv = PdfUpload.single("file");


//banner image uploads

exports.uploadBanner = upload.single("banner");
exports.resizeBanner = async (req, res, next) => {
  const admin = await Admin.findById(req?.adminId);
  try {
    if (!req.file) return next();
    req.file.filename = `event-${admin.email}-${Date.now()}.jpeg`;
    req.body.image = req.file.filename;

    await sharp(req.file.buffer)
      .resize(1080, 1080)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/assets/banners/${req.file.filename}`);

    next();
  } catch (error) {
    res.json({ error: "Error in processing file" });
    console.error(error.message);
  }
};
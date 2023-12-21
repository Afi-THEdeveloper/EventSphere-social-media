const multer = require("multer");
const sharp = require("sharp");
const Event = require("../models/EventModel");
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
      .toFile(`public/assets/Event/${req.file.filename}`);
    next();
  } catch (error) {
    res.json({ error: "error in resizing image" });
    console.log(error.message);
  }
};

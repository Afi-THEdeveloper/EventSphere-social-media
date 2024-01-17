const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
);

const BannerModel = mongoose.model("banner", bannerSchema);
module.exports = BannerModel;


// return new Date(this.createdAt.getTime() + 24 * 60 * 60 * 1000);  one day expire
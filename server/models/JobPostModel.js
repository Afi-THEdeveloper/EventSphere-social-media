const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const jobSchema = new mongoose.Schema(
  {
    eventId: {
      type: ObjectId,
      ref: "event",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    JobDescription: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    vaccancies: {
      type: Number,
      required: true,
    },
    appliedUsers: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    acceptedUsers: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    isBlocked:{
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const jobPostModel = mongoose.model("jobPost", jobSchema);
module.exports = jobPostModel;

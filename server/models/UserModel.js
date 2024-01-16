const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role:{
      type: String,
      default:'user',
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      default: "avatar.png",
    },
    isJobSeeker: {
      type: Boolean,
      default: false,
    },
    jobProfile: {
      type: {
        fullName: {
          type: String,
          required: function () {
            // Make fullName required only if jobProfile exists
            return this.jobProfile !== undefined;
          },
        },
        phone: {
          type: Number,
          required: function () {
            return this.jobProfile !== undefined;
          },
        },
        skills: {
          type: String,
          required: function () {
            return this.jobProfile !== undefined;
          },
        },
        jobRole: {
          type: String,
          required: function () {
            return this.jobProfile !== undefined;
          },
        },
        yearOfExperience: {
          type: Number,
          required: function () {
            return this.jobProfile !== undefined;
          },
        },
        CV: {
          type: String,
          required: function () {
            return this.jobProfile !== undefined;
          },
        },
      },
      default: undefined, // Set the default value to undefined
    },
    following: [
      {
        type: ObjectId,
        ref: "event",
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: {
        type: String,
      },
      generatedAt: {
        type: Date,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;

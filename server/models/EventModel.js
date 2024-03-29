const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "event",
    },
    email: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    altPhone: {
      type: Number,
      required: true,
    },
    otp: {
      code: {
        type: String,
      },
      generatedAt: {
        type: Date,
      },
    },
    services: {
      type: String,
      required: true,
    },
    officeAddress: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      default: "avatar.png",
    },
    selectedPlan: {
      plan: {
        type: ObjectId,
        ref: "Plan",
      },
      transactionId: {
        type: String,
      },
      expiry: {
        type: Date,
      },
    },
    followers: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    jobPosts: [
      {
        jobTitle: {
          type: String,
        },
        jobType: {
          type: String,
        },
        timing: {
          type: String,
        },
        skillsRequired: {
          type: String,
        },
        vaccancies: {
          type: Number,
        },
        jobDescription: {
          type: String,
        },
        experience: {
          type: String,
        },
        expires: {
          type: Date,
        },
        isBlocked: {
          type: Boolean,
        },
        likes: {
          type: Number,
          default: 0,
        },
      },
    ],
    acceptedRequests: [
      {
        job: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event.jobPost",
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    selectedPlan: {
      plan: {
        type: ObjectId,
        ref: "Plan",
      },
      transactionId: {
        type: String,
      },
      expiry: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

const eventModel = mongoose.model("event", eventSchema);
module.exports = eventModel;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
    FullName:{
        type:String,
    },
    phone:{
        type:Number,
    },
    Skills:{
        type:String,
    },
    jobExperiences:{
        type:String,
    },
    CV:{
        type:String,
    }
  },
  following: [
    {
        event:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Event'
        }
    }
  ],
  isBlocked: {
    type: Boolean,
    default: false,
  },
  otp: {
    code:{
      type:String,
    },
    generatedAt:{
      type:Date
    }
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  posts:[
    {
       location:{
        type:String,
       },
       Description:{
        type:String
       },
       media:{
        type:String,
        required:true
       },
       likes:{
        type:Number,
        default:0
       }
    }
  ],
  AcceptedJobs:[
    {
        jobPost:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Event.jobPost',
            required:true
        }
    }
  ],
  appliedJobs:[
    {
        jobPost:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Event.jobPost',
            required:true
        }
    }
  ],
 
   
},
{
  timestamps:true
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;

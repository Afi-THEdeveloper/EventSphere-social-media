const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;


const PurchaseHistory = new mongoose.Schema(
  {
    startDate:{
        type:Date,
        required:true
    },
    expireDate:{
        type:Date,
        required:true
    },
    transactionId:{
        type:String,
        required:true
    },
    plan:{
        type:ObjectId,
        ref:'plan',
        required:true
    },
    event:{
        type:ObjectId,
        ref:'event',
        required:true
    },
  },
  {
    timestamps: true,
  }
);

const purchaseHistoryModel = mongoose.model(
  "purchaseHistory",
  PurchaseHistory
);

module.exports = purchaseHistoryModel;
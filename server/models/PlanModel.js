const mongoose = require('mongoose');


const planSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    totalDays:{
        type:Number,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
}
)

const Plan = mongoose.model('plan',planSchema);
module.exports = Plan;


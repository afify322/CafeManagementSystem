const mongoose=require('mongoose')
const attend= new mongoose.Schema({
    name:{
        type:String,
    },
    date:{
        type:Date
    },
    day:{
        type:String  
    },
    income:{
        type:Number,
        default:0
    },
    outcome:{
        type:Number,
        default:0
    },
    reason:{
        type:String
    },
    porfit:{
        type:Number,
        default:0
    },
    open:{
        type:Boolean,
        default:true
    }
},{timestamps: true})
module.exports=mongoose.model('finance',attend)
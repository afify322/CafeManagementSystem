const mongoose=require('mongoose')
const moment=require('moment')
const attend= mongoose.Schema({
    name:{
        type:String,
    },
    attend:{
        type:String
    },
    leave:{
        type:String,
        default:''
    },
    total:{
        type:Number,
        default:0
    },
    expenses:{
        type:Number,
        default:0
    },
    profit:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:moment(moment().format().toString()).add(-7, 'hours')

    },
})
module.exports=mongoose.model('attend',attend)
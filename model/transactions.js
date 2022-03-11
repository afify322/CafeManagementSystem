const mongoose=require('mongoose')
const moment=require('moment')
const transaction=new mongoose.Schema({
    user:{
       type:String,
    } ,
    order:[
           {
               name:String,
               qty:String,
               price:Number
           }

        ],
    price:{
        type:Number,
        default:0
    },
    outcome:{
        type:Number,
        default:0
    },
    profit:{
        type:Number,
        default:0
    },
    reason:{
        type:String
    },
    date:String,
    day:String,
    createdAt:{
        type:Date,
        default:moment(moment().format().toString()).add(-7, 'hours')
    },
    type:{
        type:String
    }
    
})
module.exports=mongoose.model('transaction',transaction)
const mongoose=require('mongoose')
const user=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    total:{
        type:Number,
        default:0
    }
})

module.exports=mongoose.model('user',user)

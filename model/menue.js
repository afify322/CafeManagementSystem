const mongoose=require('mongoose')
const menue= mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    title:{
        type:String
    },
    price:{
        type:Number
    },
    qty:{
        type:Number
    },
    category:{
        type:String
    }
})
module.exports=mongoose.model('menue',menue)
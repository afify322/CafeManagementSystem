const transactions=require('../model/transactions')
const menue=require('../model/menue')
const router=require('express').Router()
const moment=require('moment')
const users=require('../model/user')
const attend=require('../model/attend')



router.get('/done',async(req,res)=>{
  try {
    const arr=req.session.reciept
    const price=+req.session.price
    arr.forEach(async (element) => {
      if(element.name=="فرد+كانز"){
        await menue.updateOne({name:'بيبسي'},{$inc:{qty:-element.qty}})

      }
      if(element.name=="فرد+كانز+سيرفيس"){
        await menue.updateOne({name:'بيبسي'},{$inc:{qty:-element.qty}})

      }
      else{
        await menue.updateOne({name:element.name},{$inc:{qty:-element.qty}})

      }
    });
    const time= req.session.time.toString()

   const total=await users.findOneAndUpdate({name:req.session.user},{$inc:{total:+price}},{new:true})
   await attend.findOneAndUpdate({name: req.session.user,leave:''},{total:total.total,$inc:{profit:+price}})

   await new transactions({user:req.session.user,order:arr,price:price,profit:price,date:time,day:time.slice(0, 10),type:"income",createdAt:moment(moment().format().toString()).add(-7, 'hours')}).save()
    delete req.session.reciept
    delete req.session.time
   return res.redirect('/v1/stay')
  } catch (error) {
   return res.redirect('/v1/stay')
  }

  })

  module.exports=router

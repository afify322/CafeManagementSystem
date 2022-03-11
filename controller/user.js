const router=require('express').Router()
const user=require('../model/user');
const {islogged}=require('../middleware/authguard')
const attend=require('../model/attend')
const moment=require('moment');

router.get("/login",islogged,(req,res)=>{
    res.render("login/login");
})

router.post('/login',async(req,res)=>{
    const {username ,password}=req.body
    const result=await user.findOne({name:username,password:password})
    if(!result){
        req.flash("error_msg"," خطأ في الأسم او رقم المرور ")
        return res.redirect("/user/login")
    }
    req.session.user=result.name
    req.session.role=result.role
    req.session._id=result._id
    if(result.role =='مدير'){
        return res.redirect("/admin/product")
       }
    const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")
    const exist=await attend.findOne({name:result.name,leave:''})
    if(!exist){
        new attend({name:result.name,attend:time}).save()  
      return  res.redirect('/v1/stay')
    }
   return res.redirect('/v1/stay')
})
router.get('/testcheckout',async(req,res)=>{
    const total=await user.findOne({name:req.session.user})
    res.render('menue/checkout',{total})
})
router.get('/checkout',async(req,res,next)=>{
    try {
        if(req.session.role=='مدير'){
            req.session.destroy()
           return res.redirect('/user/login')
           }
        const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")
        const total=await user.findOne({name:req.session.user})
        await attend.findOneAndUpdate({name: req.session.user,leave:''},{leave:time,total:total.total})
        await user.findOneAndUpdate({name:req.session.user},{total:0})
        req.session.destroy()
        res.redirect('/user/login')   
    } catch (error) {
        res.redirect('/user/login')   
   
    }
     
  })
router.get('/logout',async (req,res,next)=>{
    try {
        if(req.session.role=='مدير'){
            req.session.destroy()
           return res.redirect('/user/login')
           }
 
        req.session.destroy()
        res.redirect('/user/login')   
    } catch (error) {
        res.redirect('/user/login')   
   
    }
   
})
module.exports=router
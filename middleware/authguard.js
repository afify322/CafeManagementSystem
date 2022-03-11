const express=require('express')
const router=express.Router()

module.exports={
    auth:(req, res, next)=> {
        const user=req.session.user
        if(!user){
            req.flash("error_msg","برجاء تسجيل الدخول")
           return res.redirect("/user/login")
          }
          next();
    },
    islogged:(req,res,next)=>{
        const user=req.session.user

        if(user){
           return res.redirect("/v1/menue")
          }
         return next();

    },
    isAdmin:(req,res,next)=>{
          const role=req.session.role
          const user=req.session.user
          if(!user){
              req.flash("error_msg","برجاء تسجيل الدخول")
             return res.redirect("/user/login")
            }
        if(role=='مدير'){
            return  next();
          }
          return res.redirect("/v1/stay")
        
    },
    isNormal:(req,res,next)=>{
        const role=req.session.role
        const user=req.session.user
        if(!user){
            req.flash("error_msg","برجاء تسجيل الدخول")
           return res.redirect("/user/login")
          }
      if(role=='كاشير'){
        return next();
        }
        return res.redirect("/admin/product")
  }
}

const router=require('express').Router()


router.get('/',(req,res,next)=>{
    const user=req.session.user
    res.render('cal/calculator',{name:user})
})

module.exports=router
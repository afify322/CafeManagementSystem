const menue=require('../model/menue')
const router=require('express').Router()
const moment=require('moment')
const users=require('../model/user')
const transactions=require('../model/transactions')
const attend=require('../model/attend')



router.get('/stay',async (req,res,next)=>{
  
   const r=await menue.aggregate([
     {"$group":{_id:'$category', count:{$sum:2}, category: {$push: { name: '$name', price: '$price', title: '$title' }}
  }
      } , 
      {$sort: {_id: -1}} ])
const waffel=r[0].category
const milk=r[1].category
const coca=r[2].category
const winter=r[3].category
const hot=r[4].category
const grass=r[5].category
const salad=r[6].category
const fra=r[7].category
const fresh=r[8].category
const suda=r[9].category
const smozy=r[10].category
const twst=r[11].category
const fried=r[12].category
const ice=r[13].category
const dessert=r[14].category
  const name=req.session.user
    res.render("menue/stay",{soda:coca,winter,hot,grass,fra,fresh,smozy,name,ice,twst,suda,fried,dessert,milk,salad,waffel})

})

router.post('/stay',async (req,res)=>{
  var arr=[]
  var remender=0
  var chair=0
 
    JSON.stringify(req.body)
    if(Object.keys(req.body).length==0){
      
      return res.redirect('/v1/stay')
    }

    if( Object.keys(req.body).length==1 && 'كرسي' in req.body){
      const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")
      arr.push({name:'كرسي',qty:req.body.كرسي,price:10*req.body.كرسي})
     let totalPrice={price:0}
     totalPrice.price=10*req.body.كرسي
     chair=10*req.body.كرسي
     chairqty=req.body.كرسي
     req.session.reciept=arr
     req.session.time=time
     req.session.price=totalPrice.price
     return res.render('menue/receipt',{chairqty,time:time,name:req.session.user,total:totalPrice.price,chair})

   

    }
   
  
    for (const key of Object.keys(req.body)) {
      if(key=='كرسي'){
        chair=+10*req.body[key]
      }
      if(key!=='كرسي'){
        if(!req.body[key]==0 || !req.body[key]=="" )
        var obj = {name:key.replaceAll('_'," "),qty:req.body[key]};
        arr.push(obj);
        }
      }
        
        
        const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")
        var t=await Promise.all( arr.map(async(data,index)=>{
            var price= await menue.findOne({name:data.name})
            data.price=price.price*data.qty
            return {name:data.name,qty:data.qty,price:data.price }
       
     })
     )
     const total=t.map((data)=>{
       return {price:data.price}
     })
     var  totalPrice=total.reduce((a,b)=>{
      return {price:a.price + b.price}
    }) 

    const tax=Math.round((+totalPrice.price*10)/100)
    var orignalPrice
    if(chair!=0){
      arr.push({name:'كرسي',qty:chair/10,price:chair})
       orignalPrice=Math.round(+totalPrice.price )
      totalPrice.price=Math.round(totalPrice.price+tax+chair)
      chairqty=req.body.كرسي
      req.session.reciept=arr
      req.session.time=time
      req.session.price=totalPrice.price
      return res.render('menue/receipt',{s:0,chairqty,time:time,data:t,tax:tax,name:req.session.user,total:totalPrice.price,orignal:orignalPrice,chair})

    
    }
    else{
       orignalPrice=Math.round(totalPrice.price)
      totalPrice.price=Math.round(totalPrice.price+tax)
      req.session.reciept=arr
      req.session.time=time
      req.session.price=totalPrice.price
    return  res.render('menue/receipt',{s:0,time:time,data:t,tax:tax,name:req.session.user,total:totalPrice.price,orignal:orignalPrice})

    
    }
 
 

})
//--------------
router.get('/takeAway',async (req,res,next)=>{
  const name=req.session.user

   const r=await menue.aggregate([
     {"$group":{_id:'$category', count:{$sum:2}, category: {$push: { name: '$name', price: '$price', title: '$title' }}
  }
      } , 
      {$sort: {_id: -1}} ])
const waffel=r[0].category
const milk=r[1].category
const coca=r[2].category
const winter=r[3].category
const hot=r[4].category
const grass=r[5].category
const salad=r[6].category
const fra=r[7].category
const fresh=r[8].category
const suda=r[9].category
const smozy=r[10].category
const twst=r[11].category
const fried=r[12].category
const ice=r[13].category
const dessert=r[14].category
    res.render("menue/takeAway",{soda:coca,winter,hot,grass,fra,fresh,smozy,name,ice,twst,suda,fried,dessert,milk,salad,waffel})

})
router.post('/takeAway',async (req,res)=>{
  JSON.stringify(req.body)

  if(JSON.stringify(req.body)=="{}"){
    
    return res.redirect('/v1/takeAway')
  }
  const cash=req.body.cash || 0
  delete req.body.cash

  var arr=[]
  var remender=0
  for (const key of Object.keys(req.body)) {
      if(!req.body[key]==0 && !req.body[key]=="")
      var obj = {name:key.replaceAll('_'," "),qty:req.body[key]};
      arr.push(obj);
      }
      
      const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")
      var t=await Promise.all( arr.map(async(data,index)=>{

    var price= await menue.findOne({name:data.name})
    data.price=price.price*data.qty
    return {name:data.name,qty:data.qty,price:data.price }
   })
   )
   const total=t.map((data)=>{
     return {price:data.price}
   })
   var  totalPrice=total.reduce((a,b)=>{
    return {price:a.price + b.price}
  }) 

  if(!cash==0){
     remender=+cash - (+totalPrice.price)
  }
  const orignalPrice=totalPrice.price
      req.session.reciept=arr
      req.session.time=time
      req.session.price=totalPrice.price

  res.render('menue/receipt',{t:0,time:time,data:t,name:req.session.user,total:totalPrice.price,remender:remender,cash:cash,orignal:orignalPrice})
})
//-------------

router.get('/birthday',async (req,res,next)=>{
  
  const r=await menue.aggregate([
    {"$group":{_id:'$category', count:{$sum:2}, category: {$push: { name: '$name', price: '$price', title: '$title' }}
 }
     } , 
     {$sort: {_id: -1}} ])
const waffel=r[0].category
const milk=r[1].category
const coca=r[2].category
const winter=r[3].category
const hot=r[4].category
const grass=r[5].category
const salad=r[6].category
const fra=r[7].category
const fresh=r[8].category
const suda=r[9].category
const smozy=r[10].category
const twst=r[11].category
const fried=r[12].category
const ice=r[13].category
const dessert=r[14].category
 const name=req.session.user
   res.render("menue/birthday",{soda:coca,winter,hot,grass,fra,fresh,smozy,name,ice,twst,suda,fried,dessert,milk,salad,waffel})

})
router.post('/birthday',async (req,res)=>{


  var arr=[]
  var remender=0
  var person=0
 
    JSON.stringify(req.body)

    if(Object.keys(req.body).length==0){
      
      return res.redirect('/v1/birthday')
    }

    if( Object.keys(req.body).length==1 && "فرد_عيد_ميلاد" in req.body){
      const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")
      arr.push({name:'فرد_عيد_ميلاد',qty:req.body.فرد_عيد_ميلاد,price:10*req.body.فرد_عيد_ميلاد})
     let totalPrice={price:0}
     totalPrice.price=10*req.body.فرد_عيد_ميلاد
     person=10*req.body.فرد_عيد_ميلاد
     personqty=req.body.فرد_عيد_ميلاد
     req.session.reciept=arr
     req.session.time=time
     req.session.price=totalPrice.price
     return res.render('menue/receipt',{b:0,personqty,time:time,name:req.session.user,total:totalPrice.price,person:person})

   

    }
    // if(Object.keys(req.body).keys=='chair' && Object.keys(req.body).length==0){
    //   return res.redirect('/v1/stay')
    // }

  
    for (const key of Object.keys(req.body)) {
      // if(key=="تجهيزات_عيد_ميلاد"){
      //   await menue.findOneAndUpdate({name:key},{price:req.body.تجهيزات_عيد_ميلاد})
      // }

      /* if(key=='person'){
        person=+10*req.body[key]
      } */
   //   if(key!=='person'){
        if(!req.body[key]==0 || !req.body[key]=="" )
        if(key=="تجهيزات_عيد_ميلاد"){
        var b = {name:key.replaceAll('_'," "),price:+req.body[key],qty:1};
        arr.push(b);
        }else{
          var obj = {name:key.replaceAll('_'," "),qty:+req.body[key]};
          arr.push(obj);
        }
     
        }
      
        
        const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")
        var t=await Promise.all( arr.map(async(data,index)=>{
          if(data.name.replaceAll(' ',"_")=="تجهيزات_عيد_ميلاد"){
            let y =+req.body.تجهيزات_عيد_ميلاد 
            return {name:data.name,qty:1,price:+y}

          }
          if(data.name=="فرد+كانز"){
           

            var price= await menue.findOne({name:data.name.replaceAll(' ',"_")})
            data.price=price.price*data.qty
            return {name:data.name,qty:+data.qty,price:+data.price }
       
          }
          if(data.name=="فرد+كانز+سيرفيس"){

            var price= await menue.findOne({name:data.name.replaceAll(' ',"_")})
            data.price=price.price*data.qty
            return {name:data.name,qty:+data.qty,price:+data.price }
       
          }
          if(data.name.replaceAll(' ',"_")=="فرد_عيد_ميلاد"){
            var price= await menue.findOne({name:data.name.replaceAll(' ',"_")})

            data.price=price.price*data.qty
            return {name:data.name,qty:+data.qty,price:+data.price }
       
          }

     })
     )
     const total=t.map((data)=>{
       return {price:data.price}
     })
     var  totalPrice=total.reduce((a,b)=>{
      return {price:a.price + b.price}
    }) 

    var orignalPrice

       orignalPrice=Math.round(totalPrice.price)
      totalPrice.price=Math.round(totalPrice.price)
      req.session.reciept=arr
      req.session.time=time
      req.session.price=totalPrice.price
    return  res.render('menue/receipt',{b:0,time:time,data:t,name:req.session.user,total:totalPrice.price,orignal:orignalPrice})

    
    
 
 

})
//-------------

router.get('/delivery',async(req,res)=>{

  const r=await menue.aggregate([
    {"$group":{_id:'$category', count:{$sum:2}, category: {$push: { name: '$name', price: '$price', title: '$title' }}
 }
     } , 
     {$sort: {_id: -1}} ])
const waffel=r[0].category
const milk=r[1].category
const coca=r[2].category
const winter=r[3].category
const hot=r[4].category
const grass=r[5].category
const salad=r[6].category
const fra=r[7].category
const fresh=r[8].category
const suda=r[9].category
const smozy=r[10].category
const twst=r[11].category
const fried=r[12].category
const ice=r[13].category
const dessert=r[14].category
 const name=req.session.user
   res.render("menue/delivery",{soda:coca,winter,hot,grass,fra,fresh,smozy,name,ice,twst,suda,fried,dessert,milk,salad,waffel})

})
router.post('/delivery',async(req,res)=>{
  JSON.stringify(req.body)

  if(Object.keys(req.body).length==0){
    console.log(req.body)
    return res.redirect('/v1/delivery')
  }
  const {delivery}=req.body 
  delete req.body.delivery

  var arr=[]
  var remender=0
  for (const key of Object.keys(req.body)) {
      if(!req.body[key]==0 && !req.body[key]=="")
      var obj = {name:key.replaceAll('_'," "),qty:req.body[key]};
      arr.push(obj);
      }
      
      const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")
      var t=await Promise.all( arr.map(async(data,index)=>{

    var price= await menue.findOne({name:data.name})
    data.price=price.price*data.qty
    return {name:data.name,qty:data.qty,price:data.price }
   })
   )
   const total=t.map((data)=>{
     return {price:data.price}
   })
   var  totalPrice=total.reduce((a,b)=>{
    return {price:a.price + b.price}
  }) 

  const tax=15
  
  const orignalPrice=totalPrice.price
  totalPrice.price=totalPrice.price+tax
      req.session.reciept=arr
      req.session.time=time
      req.session.price=+totalPrice.price -15

  res.render('menue/receipt',{d:0,time:time,data:t,delivery:delivery,name:req.session.user,total:totalPrice.price,orignal:orignalPrice})

})
//--------------
router.get('/addExpenses',async (req,res)=>{
  const name=req.session.user

  res.render('menue/expenses',{name})
})
router.post('/expenses',async(req,res)=>{
  const name=req.session.user

 
  const {reason,out}=req.body
  const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")
  const total=await users.findOneAndUpdate({name:req.session.user},{$inc:{total:-out}},{new:true})
  await attend.findOneAndUpdate({name: req.session.user,leave:''},{total:total.total,$inc:{expenses:+out}},{new:true})

  await new transactions({user:name,outcome:out,profit:-out,date:time,day:time.slice(0, 10),type:"outcome",reason:reason}).save()
  res.redirect('/v1/addExpenses')

})



router.get('/calculator',(req,res,next)=>{
  const user=req.session.user
  res.render('cal/calculator',{name:user})
})










module.exports=router
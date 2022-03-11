const menue=require('../model/menue')
const router=require('express').Router()
const transactions=require('../model/transactions')
const users=require('../model/user')
const moment=require('moment')
const attend=require('../model/attend')
const finance =require('../model/finance')

router.get('/product',async(req,res)=>{
   const r=await menue.aggregate([
     {"$group":{_id:'$category', count:{$sum:2}, category: {$push: { name: '$name', price: '$price', title: '$title',_id:"$_id",qty:"$qty" }}
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
    res.render("admin/products",{soda:coca,winter,hot,grass,fra,fresh,smozy,name,ice,twst,suda,fried,dessert,milk,salad,waffel})
})

router.get('/editproduct',async(req,res)=>{
  const name=req.session.user

  const {_id}=req.query
  const result=await menue.findOne({_id:_id})
  const {price,qty,category,title}=result
  res.render('admin/editProduct',{name1:result.name,title,name,price,qty,category,_id:result._id})
})
router.post('/editproduct',async(req,res)=>{
  try {
    const {qty,price,_id}=req.body
    await menue.findOneAndUpdate({_id:_id},{qty,price})
    res.redirect('/admin/product')
  } catch (error) {
    req.flash("error_msg","الرجاء المحاولة مره أخرى")
    res.redirect('/admin/editproduct')
  }

})

router.get('/deleteproduct',async(req,res)=>{
  try {
    const {_id}=req.query
    await menue.findOneAndDelete({_id:_id})
    res.redirect('/admin/product')
  } catch (error) {
    req.flash("error_msg","الرجاء المحاولة مره أخرى")
    res.redirect('/admin/product')
  }
})
router.post('/product',async (req,res)=>{
    JSON.stringify(req.body)
    const {name,price,qty,category}=req.body

    const title=name.replaceAll(" ","_")
    const product=await menue.findOne({name})
    if(product){
      req.flash("error_msg"," هذا الصنف موجود بالفعل ")
     return res.redirect('/admin/addproduct')

    }
     new menue({name,title,price,qty,category}).save()
    res.redirect("/admin/addproduct") 
})


router.get('/addproduct',async (req,res)=>{
  const name=req.session.user

  const result=await menue.aggregate([{$group:{_id:"$category"}}])
    res.render('admin/addProduct',{result:result,name})
})
//------------
router.get('/transaction',async (req,res)=>{
  try {
    const name=req.session.user
    const {page}=req.query || 1
    const count=await transactions.find().countDocuments()
  
    const result= await transactions.find({type:"income"}).skip((page-1)*60).limit(60).sort({_id:-1})
    const pages=Math.ceil(count/60)
    var arr=[]
  
    for(let i=1;i<=pages;i++){
      arr.push({page:i})
    }
   
    res.render('admin/transactions',{result:result,pages:pages,arr,name})
     
  } catch (error) {
    res.redirect('/admin/transaction')
  }
 
})

router.post('/transaction',async(req,res)=>{
  var {date}=req.body
  var d=date.split("-").reverse()
  var k=d[0]
  d[0]=d[1]
  d[1]=k
  const time=d.join('/')
  const result=await transactions.find({date:{$regex:time?? "",$options:'i'}})
  res.render('admin/transactions',{result:result})
})

router.get('/deleteTransaction',async(req,res)=>{
  const {_id}=req.query
  const result=await transactions.findOne({_id:_id})
  const total=await users.findOneAndUpdate({name:result.user},{$inc:{total:-result.price}},{new:true})
  await attend.findOneAndUpdate({name: result.user,leave:''},{total:total.total,$inc:{profit:-result.price}})

   result.order.forEach(async (element) => {
    await menue.updateOne({name:element.name},{$inc:{qty:+element.qty}})
  });
 const deleted= await transactions.findByIdAndDelete(_id)
  res.redirect('/admin/transaction') 
})
//-------------
router.get('/recieptReview',async (req,res)=>{
const name=req.session.user
const {_id}=req.query
const result=await transactions.findOne({_id:_id})
res.render('menue/receipt',{name,data:result.order,time:result.date,total:result.price,name:result.user,review:true})
})

router.get('/clerks',async (req,res)=>{
  const name=req.session.user

const clerks=await users.find({role:'كاشير'})
res.render('admin/clerks',{result:clerks,name})
})
router.get('/addclerk',async (req,res)=>{
  const name=req.session.user

  res.render('admin/addClerk',{name})
})
router.post('/addclerk',async (req,res)=>{
  const {name,password}=req.body
  new users({name:name,password:password,role:'كاشير'}).save()
  res.redirect('/admin/clerks')
})
router.get('/deleteclerk',async (req,res)=>{
  const {_id}=req.query
  await users.deleteOne({_id:_id})
  res.redirect('/admin/clerks')
})

router.get('/attend',async (req,res)=>{
  const name=req.session.user
  const {page}=req.query || 1
  const count=await attend.find().countDocuments()
  const pages=Math.ceil(count/20)
  var arr=[]

  for(let i=1;i<=pages;i++){
    arr.push({page:i})
  }
const result=await attend.find().sort({createdAt:-1})
res.render('admin/attend',{result,pages:pages,arr,name})
})
router.post('/attend',async(req,res)=>{
  var {date}=req.body
  var d=date.split("-").reverse()
  var k=d[0]
  d[0]=d[1]
  d[1]=k
  const time=d.join('/')
  const result=await attend.find({attend:{$regex:time?? "",$options:'i'}})
  res.render('admin/attend',{result})
})
router.get('/finance',async (req,res)=>{
  const name=req.session.user
  const result=await transactions.aggregate([
    {
    $group:{_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }},total:{$sum:'$price'},outcome:{$sum:'$outcome'},
    profit:{$sum:'$profit'},count:{$sum:1}}
  }, 
  { $sort: { _id: -1 } }  
])

res.render('admin/finance',{result,name})
})
router.post('/finance',async (req,res)=>{
  const {date}=req.body || ''
  let d=date.split("-").reverse()
  let k=d[0]
  d[0]=d[1]
  d[1]=k
  var time=d.join('/')
 
  const result=await transactions.aggregate([
    { $match:{day:time ?? ''}},
    {
    $group:{_id:"$day",total:{$sum:'$price'},outcome:{$sum:'$outcome'},
    profit:{$sum:'$profit'},count:{$sum:1}},
   
  }])
  res.render('admin/finance',{result})
})
router.get('/Acalculator',(req,res)=>{
  const name=req.session.user
  res.render('cal/Acalculator',{name})
})
router.get('/expenses',async(req,res)=>{
  const name=req.session.user
  const {page}=req.query || 1
  const count=await transactions.find({type:'outcome'}).countDocuments()
  const pages=Math.ceil(count/20)
  var arr=[]

  for(let i=1;i<=pages;i++){
    arr.push({page:i})
  }
  const result=await transactions.find({type:"outcome"}).skip((+page -1)*20).limit(20).sort({createdAt:-1}) 
  res.render("admin/expenses",{result:result,pages:pages,arr,name})
})
router.post('/getexpenses',async(req,res)=>{
  var {date}=req.body
  var d=date.split("-").reverse()
  var k=d[0]
  d[0]=d[1]
  d[1]=k
  const time=d.join('/')
  const result=await transactions.find({type:"outcome",date:{$regex:time?? "",$options:'i'}})
  res.render('admin/expenses',{result})
})
router.get('/addExpenses',async (req,res)=>{
  const name=req.session.user
  res.render('admin/addExpenses',{name})
})
router.post('/expenses',async(req,res)=>{
  const name=req.session.user

 
  const {reason,out}=req.body
  const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")
  await new transactions({user:name,outcome:out,profit:-out,date:time,day:time.slice(0, 10),type:"outcome",reason:reason}).save()
  const total=await users.findOneAndUpdate({name:req.session.user},{$inc:{total:-out}},{new:true})
  console.log(total);
  await attend.findOneAndUpdate({name: req.session.user,leave:''},{total:total.total,$inc:{expenses:+out}},{new:true})

  res.redirect('/admin/expenses')

})
router.post('/dailyReport',async (req,res)=>{
  const name=req.session.user
  let a;
  let b;
  if (req.body.lte) {
    a = new Date(req.body.lte+'T23:59:59.925+00:00');
  }
  if (req.body.gte) {
    b = new Date(req.body.gte+'T00:00:00.00+00:00');
  }
  const operations=await transactions.aggregate([
  {
    $facet :{
      "total":[
        {$match:{createdAt:{ $gte: b ?? new Date('2000-01-08T08:36:37.725+00:00'),
        $lte: a ?? new Date('2100-01-08T08:36:37.725+00:00'), }
        },
      },
      {$group:{_id:null,  outcome: {$sum: '$outcome'},
      total: {$sum: '$price'},
      profit: {$sum: '$profit'},}}

    ],
   
      "operation":[
        
        {$match:{createdAt:{ $gte: b ?? new Date('2000-01-08T08:36:37.725+00:00'),
        $lte: a ?? new Date('2100-01-08T08:36:37.725+00:00') }
        }},
        {
          
          $group:{_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          month:{$sum:1},
          outcome: {$sum: '$outcome'},
        total: {$sum: '$price'},
        profit: {$sum: '$profit'},

       }
      
      },
      {$sort:{_id:1}}

      
      ]
      
    }
    
  },
  
])
const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")
const total=operations[0].total[0]
const result=operations[0].operation
// return res.json({result,total})
return res.render('admin/dailyReport',{result,total,time})
})
router.get('/reportwardea',async(req,res)=>{
  const {_id}=req.query
  const result=await attend.findById(_id)
  result.attend=result.attend.slice(1,10)
  const time= moment().format('L').toString().concat(" ",moment().format('LTS').toString()," ")

  res.render('admin/reportwardea',{result,time})
})


module.exports=router
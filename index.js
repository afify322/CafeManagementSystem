const express=require('express')
const path =require('path')
const app=express()
require('./middleware/database')
const morgan=require("morgan")
const flash=require('connect-flash')
const hbs =require('hbs');
const bodyparser=require('body-parser')
const menue=require('./controller/menue')
const user=require('./controller/user')
const session = require('express-session')
const {isAdmin}=require('./middleware/authguard')
const caculator=require('./controller/cal')
const trans=require('./controller/accounting')
const product=require('./controller/admin')
const {isNormal}=require('./middleware/authguard')

hbs.registerPartials(__dirname + '/views/Partials');
hbs.registerPartial('Aheader',"{{Aheader}}")
hbs.registerPartial('Afooter',"{{Afooter}}")
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(morgan('combined'))
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  store:store
  
}));
app.use(flash());


app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use('/user',user)

app.use('/admin',  isAdmin,  product)
app.use('/v2',trans)
app.use('/v1', isNormal,   menue)
app.use((req,res,next)=>{
  res.redirect("/v1/stay")
})

let port=3000 | process.env.PORT;

app.listen(port , ()=>{
} )

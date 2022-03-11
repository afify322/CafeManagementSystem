const mongoose=require('mongoose')
mongoose.connect(procces.env.DB,{
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser:true,
    useUnifiedTopology:true
  })
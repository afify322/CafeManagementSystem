const mongoose=require('mongoose')
mongoose.connect(process.env.DB,{
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser:true,
    useUnifiedTopology:true
  })

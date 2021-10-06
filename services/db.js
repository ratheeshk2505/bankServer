const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/bankApp',{useNewUrlParser:true})
const User = mongoose.model('User',{
    p_name:String,
    ac_no:Number,
    uname:String,
    p_word1:String,
    balance:Number,
    transaction:[]
})

module.exports={ User } 
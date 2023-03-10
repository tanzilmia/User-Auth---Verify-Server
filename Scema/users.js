const mongoose =  require("mongoose")
const userScema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    verify:Boolean
    
})

module.exports = userScema
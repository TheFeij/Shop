const mongoose = require("mongoose")
const winston = require("winston")

// a function to connect to mongodb server
module.exports = async function(){
    await mongoose.connect(process.env.DB)
    winston.info("connected to mongodb...")
}

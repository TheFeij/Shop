const mongoose = require("mongoose")
const config = require("config")
const winston = require("winston")

// a function to connect to mongodb server
module.exports = async function(){
    await mongoose.connect(config.get("Database.connectionString"))
    winston.info("connected to mongodb...")
}

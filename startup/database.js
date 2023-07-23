const mongoose = require("mongoose");   // Import Mongoose for MongoDB interactions
const winston = require("winston");     // Import Winston for logging

// Function to connect to the MongoDB server using Mongoose
module.exports = async function(){
    await mongoose.connect(process.env.DB)
    winston.info("connected to mongodb...")
}

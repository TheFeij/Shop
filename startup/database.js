const mongoose = require("mongoose")   // Import Mongoose for MongoDB interactions
const winston = require("winston")     // Import Winston for logging



/**
 * Function to connect to the MongoDB server using Mongoose.
 *
 * @return {Promise<void>} - A Promise that resolves when the connection to
 * the database is established.
 */
module.exports = async function(){
    await mongoose.connect(process.env.DB)
    winston.info("connected to mongodb...")
}

const mongoose = require("mongoose")   // Import Mongoose for MongoDB interactions
const winston = require("winston")     // Import Winston for logging



/**
 * Function to connect to the MongoDB server using Mongoose.
 *
 * @return {Promise<void>} - A Promise that resolves when the connection to
 * the database is established.
 */
module.exports = async function(){
    // checking the environment and deciding which database to connect to
    // if in test environment connect to tests database
    await mongoose.connect(process.env.NODE_ENV === "test" ? process.env.DB_TESTS : process.env.DB)

    winston.info("connected to mongodb...")
}

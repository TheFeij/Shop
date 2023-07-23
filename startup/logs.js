const winston = require("winston")  // Import Winston for logging
require("winston-transport")        // Import the base Winston Transport module
require("winston-mongodb")          // Import Winston MongoDB's Transport for logging to MongoDB



/**
 * Function to add transports to winston and add two listeners for uncaughtExceptions
 * and unhandledRejections
 */
module.exports = function(){
    // Adding console, file and mongodb transports to winston
    winston.add(new winston.transports.Console())
    winston.add(new winston.transports.File({filename: "logsFile.log"}))
    winston.add(new winston.transports.MongoDB({
        db: process.env.DB,
        level: "info"
    }))


    // Catching uncaught exceptions in the app outside the scope of express
    // (exceptions in the scope of express will be handled by a middleware function)
    process.on("uncaughtException", (ex) => {
        winston.error(ex.message, ex)
        process.exit(1)
    })

    // Catching unhandled promise rejections in the app outside the scope of express
    // (rejections in the scope of express will be handled by a middleware function)
    process.on("unhandledRejection", (ex) => {
        winston.error(ex.message, ex)
        process.exit(1)
    })
}
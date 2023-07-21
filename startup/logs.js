const config = require("config")
const winston = require("winston")
require("winston-transport")
require("winston-mongodb")


// a function to add transports to winston and add two listeners for uncaughtExceptions
// and unhandledRejections
module.exports = function(){

    // adding console, file and mongodb transports to winston
    winston.add(new winston.transports.Console())
    winston.add(new winston.transports.File({filename: "logsFile.log"}))
    winston.add(new winston.transports.MongoDB({
        db: config.get("Database.connectionString"),
        level: "info"
    }))


    // catching uncaught exceptions in the app outside the scope of express
    // (exceptions in the scope of express will be handled by a middleware function)
    process.on("uncaughtException", (ex) => {
        winston.error(ex.message, ex)
        process.exit(1)
    })

    // catching unhandled promise rejections in the app outside the scope of express
    // (rejections in the scope of express will be handled by a middleware function)
    process.on("uncaughtException", (ex) => {
        winston.error(ex.message, ex)
        process.exit(1)
    })
}
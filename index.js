// Import required modules and libraries
const express = require("express")     // Express.js web framework
const app = express()                  // An instance of the Express application
const winston = require("winston")     // Logger library for logging
const fs = require("fs")               // File system module for file operations
const https = require("https")         // HTTPS module for creating secure server



// Load environment variables from the .env file using 'dotenv' package
require('dotenv').config()
// Set up application routes by importing and calling the 'routes' module
require("./startup/routes")(app)
// Initialize logging configuration to capture application logs
require("./startup/logs")()
// Connect to the database and set up models and schemas
require("./startup/database")()



// Set the port number from environment variables. if not defined, set it to 3000
const PORT = process.env.PORT || 3000

// Loading the SSL key and certificate from the 'ssl' directory
const httpsOptions = {
    key: fs.readFileSync("./ssl/key.pem"),
    cert: fs.readFileSync('./ssl/cert.pem')
};

// Creating an HTTPS server that uses the SSL key and certificate,
// and points to the Express app
https
    .createServer(httpsOptions, app)
    .listen(PORT, ()=>{
        winston.info(`Listening on port ${PORT}...`)
    })



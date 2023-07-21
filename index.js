const express = require("express")
const app = express()
const winston = require("winston")
const fs = require("fs")
const https = require("https")


require("./startup/routes")(app)


const PORT = process.env.PORT | 3000

const httpsOptions = {
    key: fs.readFileSync("./ssl/key.pem"),
    cert: fs.readFileSync('./ssl/cert.pem')
};


// A HTTPS listener on port 4000 that points to the Express app
// Used a callback function to tell when the server is created.
https
    .createServer(httpsOptions, app)
    .listen(PORT, ()=>{
        winston.info(`Listening on port ${PORT}...`)
    });



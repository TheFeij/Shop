const express = require("express")                      // Importing the Express framework
const router = express.Router()                         // Creating an Express router instance
const asyncMiddleware = require("../middlewares/async") // asyncMiddleware for handling asynchronous operations



/**
 * Route handler for the home page displaying a greeting message
 */
router.get("/", asyncMiddleware((req, res)=>{
    res.send("Hello! Welcome To Our Shop!")
}) )



// Exporting the router to be used in other parts of the application
module.exports = router
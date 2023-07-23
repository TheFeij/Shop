const express = require("express")                              // Importing the Express framework
const router = express.Router()                                 // Creating an Express router instance
const bcrypt = require("bcrypt")                                // Importing bcrypt for password hashing
const asyncMiddleware = require("../middlewares/async")         // asyncMiddleware for handling asynchronous operations
const { UserModel, validateLogin } = require("../models/user")  // functions from the user model



/**
 * Handles user login and authentication.
 *
 * This route handler is responsible for validating the login information received from the client,
 * retrieving the user document from the database based on the provided email, checking the user's
 * account verification status, comparing the provided password with the hashed password stored in
 * the database, generating a long-lived refresh token for the user, and sending it back in the response header.
 */
 router.post("/", asyncMiddleware(async (req, res) => {

    // Validate login information
    const {error} = validateLogin(req.body)
    if(error){
        res.status(400).send(error.details[0].message)
        return
    }

    // Find and retrieve the user document from the database
    const user = await UserModel.findOne({email: req.body.email})
    if(!user){
        return res.status(400).send("invalid email or password")
    }
    if(user.isVerified === false){
        return res.status(403).send("account not verified")
    }

    // Check if the provided password is correct or not
    const result = await bcrypt.compare(req.body.password, user.password)
    if(!result){
        return res.status(400).send("invalid email or password")
    }

    // Generate a long-lived refresh token and send it to the client
    const refreshToken = user.generateRefreshToken()

    // Set the "x-refresh-token" header with the refresh token and send it
    res.set("x-refresh-token", refreshToken);
    res.send("refresh token created successfully")
}))



// Exporting the router to be used in other parts of the application
module.exports = router
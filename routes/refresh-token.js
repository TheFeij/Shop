const express = require("express")                         // Express framework for building web applications
const router = express.Router()                            // Creating an Express router instance
const asyncMiddleware = require("../middlewares/async")    // Middleware for handling asynchronous routes
const { UserModel } = require("../models/user")            // Importing the UserModel from the 'user' model module
const jwt = require("jsonwebtoken")                        // JSON Web Token (JWT) module for token generation



/**
 * Route handler for refreshing the access token.
 *
 * This route handler is responsible for refreshing the access token for a user based on the provided refresh token.
 * It uses the 'asyncMiddleware' for handling asynchronous route functions. The handler reads the refresh token
 * from the request's header and verifies it using the JWT library and the provided JWT private key. If the refresh
 * token is valid, the user associated with the token is retrieved from the database, and a new short-lived access token
 * is generated for the user. The new access token is then set in the response header and sent back to the client.
 */
router.get("/", asyncMiddleware(async (req, res) => {
    // Reading refresh token from the request's header
    const token = req.header("x-refresh-token")
    if(!token){
        return res.status(401).send("access denied. no token provided")
    }

    // Variable to hold the decoded object of the JWT
    let decoded
    // Verify the token save the decoded value to user
    try {
        decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    } catch(ex){
        return res.status(400).send("invalid token")
    }

    // Find the user
    const user = await UserModel.findOne({_id: decoded.id})
    if(!user){
        return res.status(401).send("invalid token")
    }

    // Generate a new short-lived access token and send it to the client
    const accessToken = user.generateAccessToken()

    // Set the "x-access-token" header with the access token and send it
    res.set("x-access-token", accessToken)
    res.send("access token created successfully")
}))



// Exporting the router to be used in other parts of the application
module.exports = router
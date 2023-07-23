const express = require("express")                      // Express framework for building web applications
const router = express.Router()                         // Creating an Express router instance
const jwt = require("jsonwebtoken");                    // JSON Web Token module for token generation and verification
const asyncMiddleware = require("../middlewares/async") // Custom middleware for handling asynchronous routes
const { UserModel } = require("../models/user")         // Importing the UserModel from the 'user' model module




/**
 * Route handler for email verification.
 *
 * This route handler is responsible for verifying the user's email by validating the provided verification token
 * in the query parameter. It uses the 'jwt.verify' function to decode and verify the token with the 'JWT_PRIVATE_KEY'
 * from the environment variables. If the token is valid, it searches for the corresponding user using the '_id' from
 * the token in the 'UserModel'. If the user is found, their 'isVerified' field is updated to true, indicating that
 * the email has been verified. The changes are then saved to the database, and a success response is sent to the client
 * If the provided token is invalid or no user is found, an error response is sent with the appropriate error message.
 */
router.get("/", asyncMiddleware(async (req, res) => {

    // Verifying the verification token:
    const token = jwt.verify(req.query.token, process.env.JWT_PRIVATE_KEY)

    // Find the user with the provided token
    const user = await UserModel.findOne({_id: token.id});

    // If a user with the given verification token is not found
    if (!user) {
        return res.status(400).send("Invalid token")
    }

    // Mark the user's email as verified
    user.isVerified = true
    // Saving changes to the database
    await user.save()

    res.send("Email verified successfully")
}));



// Exporting the router to be used in other parts of the application
module.exports = router
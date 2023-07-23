const express = require("express")                             // Express framework for building web applications
const router = express.Router()                                // Creating an Express router instance
const asyncMiddleware = require("../middlewares/async")        // Custom middleware for handling asynchronous routes
const { validateUser, UserModel } = require("../models/user")  // Importing the validateUser function and UserModel



/**
 * Route handler for user registration.
 *
 * This route handler is responsible for validating the user's input received from the client during the
 * registration process. It uses the 'validateUser' function to validate the user object. If the input is
 * invalid, an error response is sent with the appropriate error message. If the email provided by the user
 * is already registered, a duplicate email error response is sent. Otherwise, a new user document is defined
 * using the 'UserModel' with the provided user details (firstname, lastname, email, password). The user's
 * password is then hashed for security, and the user document is saved to the database. A verification email
 * is also sent to the user using the 'sendVerificationEmail' method of the user object.
 */
router.post("/", asyncMiddleware(async (req, res) => {
    // First validating user's input
    const {error} = validateUser(req.body)
    if(error){
        res.status(400).send(error.details[0].message)
        return
    }

    // Check if email already exists
    if(await UserModel.findOne({email: req.body.email})){
        res.status(400).send("email already registered")
    }

    // Defining user
    const user = new UserModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
    })

    // Hashing user password
    await user.hashPassword()
    // Saving user to the database
    await user.save()
    // Send the verification email
    await user.sendVerificationEmail()

    res.send("Verification email sent. Please check your inbox.")
}))



// Exporting the router to be used in other parts of the application
module.exports = router
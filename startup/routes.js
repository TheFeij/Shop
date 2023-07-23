const express = require("express")                            // Import Express.js web framework
const homeRouter = require("../routes/home")                  // Import router for the home page
const signupRouter = require("../routes/signup")              // Import router for user signup
const verifyRouter = require("../routes/verify")              // Import router for email verification
const loginRouter = require("../routes/login")                // Import router for user login
const refreshTokenRouter = require("../routes/refresh-token") // Import router for refreshing access tokens
const productsRouter = require("../routes/products")          // Import router for handling products



/**
 * Function to set up Express application with routers and JSON middleware.
 *
 * @param {Object} app - The Express application instance.
 */
module.exports = function(app){
    app.use(express.json())
    app.use("/", homeRouter)
    app.use("/signup", signupRouter)
    app.use("/verify", verifyRouter)
    app.use("/login", loginRouter)
    app.use("/refresh-token", refreshTokenRouter)
    app.use("/products", productsRouter)
}
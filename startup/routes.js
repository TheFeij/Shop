const express = require("express")
const homeRouter = require("../routes/home")
const signupRouter = require("../routes/signup")
const verifyRouter = require("../routes/verify")

// a function to add all the routers to express
module.exports = function(app){
    app.use(express.json())
    app.use("/", homeRouter)
    app.use("/signup", signupRouter)
    app.use("/verify", verifyRouter)
}
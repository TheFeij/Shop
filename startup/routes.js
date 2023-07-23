const express = require("express")
const homeRouter = require("../routes/home")
const signupRouter = require("../routes/signup")
const verifyRouter = require("../routes/verify")
const loginRouter = require("../routes/login")
const refreshTokenRouter = require("../routes/refresh-token")
const productsRouter = require("../routes/products")

// a function to add all the routers to express
module.exports = function(app){
    app.use(express.json())
    app.use("/", homeRouter)
    app.use("/signup", signupRouter)
    app.use("/verify", verifyRouter)
    app.use("/login", loginRouter)
    app.use("/refresh-token", refreshTokenRouter)
    app.use("/products", productsRouter())
}
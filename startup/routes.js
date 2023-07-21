const express = require("express")
const homeRouter = require("../routes/home")

// a function to add all the routers to express
module.exports = function(app){
    app.use(express.json())
    app.use("/", homeRouter)
}
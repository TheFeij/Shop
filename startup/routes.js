const express = require("express")
const homeRouter = require("../routes/home")

module.exports = function(app){
    app.use(express.json())
    app.use("/", homeRouter)
}
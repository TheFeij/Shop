const express = require("express")
const router = express.Router()
const asyncMiddleware = require("../middlewares/async")




// a route handler for the home page displaying a greeting message
router.get("/", asyncMiddleware((req, res)=>{
    res.send("Hello! Welcome To Our Shop!")
    console.log(req.body)
}) )



module.exports = router
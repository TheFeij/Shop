const express = require("express")
const router = express.Router()




// a route handler for the home page displaying greeting message
router.get("/", (req,res)=>{
    res.send("Hello! Welcome To Our Shop!")
})



module.exports = router
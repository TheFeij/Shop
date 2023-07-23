const express = require("express")
const router = express.Router()
const asyncMiddleware = require("../middlewares/async")
const {UserModel} = require("../models/user")
const jwt = require("jsonwebtoken")


router.get("/", asyncMiddleware(async (req, res) => {

    //reading refresh token from the request's header
    const token = req.header("x-refresh-token")
    if(!token){
        return res.status(401).send("access denied. no token provided")
    }

    // variable to hold the decoded object of the JWT
    let decoded
    // verify the token save the decoded value to user
    try {
        decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    } catch(ex){
        return res.status(400).send("invalid token")
    }

    // find the user
    const user = await UserModel.findOne({_id: decoded.id})
    if(!user){
        return res.status(401).send("invalid token")
    }

    // generate a new short-lived access token and send it to the client
    const accessToken = user.generateAccessToken()

    // Set the "x-access-token" header with the access token and send it
    res.set("x-access-token", accessToken)
    res.send("access token created successfully")
}))


module.exports = router
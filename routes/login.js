const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const asyncMiddleware = require("../middlewares/async")
const {UserModel, validateLogin} = require("../models/user");


router.post("/", asyncMiddleware(async (req, res) => {

    // validate login information
    const {error} = validateLogin(req.body)
    if(error){
        res.status(400).send(error.details[0].message)
        return
    }

    // find and retrieve the user document from the database
    const user = await UserModel.findOne({email: req.body.email})
    if(!user){
        return res.status(400).send("invalid email or password")
    }
    if(user.isVerified === false){
        return res.status(403).send("account not verified")
    }

    // check if the provided password is correct or not
    const result = await bcrypt.compare(req.body.password, user.password)
    if(!result){
        return res.status(400).send("invalid email or password")
    }

    // generate a long-lived refresh token and send it to the client
    const token = user.generateRefreshToken()
    res.send(token)
}))


module.exports = router
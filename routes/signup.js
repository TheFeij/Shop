const _ = require("lodash")
const express = require("express")
const router = express.Router()
const asyncMiddleware = require("../middlewares/async")
const {validateUser, UserModel} = require("../models/user");


router.post("/", asyncMiddleware(async (req, res) => {

    // first validating user's input
    const {error} = validateUser(req.body)
    if(error){
        res.status(400).send(error.details[0].message)
        return
    }

    // check if email already exists
    if(await UserModel.findOne({email: req.body.email})){
        res.status(400).send("email already registered")
    }

    // defining user
    const user = new UserModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
    })

    // hashing user password
    await user.hashPassword()
    // saving user to the database
    await user.save()
    // send the verification email
    await user.sendVerificationEmail()

    res.send("Verification email sent. Please check your inbox.")
}))


module.exports = router
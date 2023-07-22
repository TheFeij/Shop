const _ = require("lodash")
const bcrypt = require("bcrypt")
const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const asyncMiddleware = require("../middlewares/async")
const {validateUser, UserModel} = require("../models/user");


router("/", asyncMiddleware(async (req, res) => {

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
        email: req.body.name,
        password: req.body.password,
    })

    // hashing user password
    await user.hashPassword()
    // setting a verification token for user
    user.setVerificationToken()
    // saving user to the database
    await user.save()

    // here it should send a verification email to the user

}))
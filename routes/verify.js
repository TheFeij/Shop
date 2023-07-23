const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const asyncMiddleware = require("../middlewares/async")
const {UserModel} = require("../models/user");


router.get("/", asyncMiddleware(async (req, res) => {

    // verifying the verification token:
    const token = jwt.verify(req.query.token, process.env.JWT_PRIVATE_KEY)

    // Find the user with the provided token
    const user = await UserModel.findOne({_id: token.id});

    // if a user with the given verification token is not found
    if (!user) {
        return res.status(400).send("Invalid token")
    }

    // Mark the user's email as verified
    user.isVerified = true
    // saving changes to the database
    await user.save()

    res.send("Email verified successfully")
}));


module.exports = router
const mongoose = require("mongoose")


// defining user schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: 5,
        maxLength: 255,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 1024,
    }
    // other properties to be added
})

// creating our user model
const UserModel = mongoose.model("user", userSchema)


module.exports.UserModel = UserModel
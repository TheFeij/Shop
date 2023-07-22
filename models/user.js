const mongoose = require("mongoose")
const Joi = require("joi")
const bcrypt = require("bcrypt");
const crypto = require("crypto");


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
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    verificationToken: {
        type: String,
        length: 32
    }
    // other properties to be added
})

/**
 * a method to hash user's password
 * @return {Promise<void>}
 */
userSchema.methods.hashPassword = async function(){
    const salt = await bcrypt.genSalt(10)
    this.password  = await bcrypt.hash(this.password, salt)
}

/**
 * a method to set a verification token for the user
 */
userSchema.methods.setVerificationToken = function(){
    this.verificationToken = crypto.randomBytes(32).toString("hex")
}

// creating our user model
const UserModel = mongoose.model("user", userSchema)


/**
 * a function to validate a user object received from the client
 * in the sign-up process
 * @param userObject user object to be validated
 * @return {Joi.ValidationResult<any>}
 */
function validateUser(userObject){
    const schema = Joi.object({
        firstname: Joi
            .string()
            .required()
            .min(2)
            .max(30),
        lastname: Joi
            .string()
            .required()
            .min(2)
            .max(30),
        email: Joi
            .string()
            .required()
            .email()
            .min(5)
            .max(255),
        password: Joi
            .string()
            .required()
            .min(8)
            .max(255),
    })

    return schema.validate(userObject)
}


module.exports.UserModel = UserModel
module.exports.validateUser = validateUser
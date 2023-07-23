const mongoose = require("mongoose")       // Mongoose for MongoDB interactions
const Joi = require("joi")                 // Joi for data validation
const bcrypt = require("bcrypt")           // Bcrypt for password hashing
const nodemailer = require("nodemailer")   // Nodemailer for sending emails
const jwt = require("jsonwebtoken")        // JSON Web Token handling



// Defining user schema
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
    }
}, {timestamps: true})

/**
 * Method to hash user's password
 * @return {Promise<void>}
 */
userSchema.methods.hashPassword = async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
}

/**
 * Method to send a verification email to the user
 * @return {Promise<void>}
 */
userSchema.methods.sendVerificationEmail = async function() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Creating a verification token
    const verificationToken = jwt.sign({id: this._id},
        process.env.JWT_PRIVATE_KEY, {expiresIn: "1d"})

    // Creating mail options
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: this.email,
        subject: 'Email Verification',
        html: `
                <p>Hello,</p>
                <p>Please click the following link to verify your email:</p>
                <a href="https://localhost:3000/verify?token=${verificationToken}">Verify Email</a>
                `,
    };

    // Sending the email
    await transporter.sendMail(mailOptions);
}

/**
 * Method to generate a refresh token
 * @return {*}
 */
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_PRIVATE_KEY, {expiresIn: "12h"})
}

/**
 * Method to generate a short-lived access token
 * @return {*}
 */
userSchema.methods.generateAccessToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_PRIVATE_KEY, {expiresIn: "10m"})
}

// Creating the user model using userSchema
const UserModel = mongoose.model("user", userSchema)



/**
 * Function to validate a user object received from the client during the sign-up process.
 *
 * @param {Object} userObject - The user object to be validated.
 * @return {Joi.ValidationResult<any>} - The result of the validation using the Joi schema.
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

/**
 * A function to validate login information.
 * It only validates data and checks if it is in the correct format.
 * It does not check if the password is correct or if the user exists or not.
 *
 * @param {Object} loginObject - Contains user's email and password.
 * @return {Joi.ValidationResult<any>} - The result of the validation using the Joi schema.
 */
function validateLogin(loginObject){
    const schema = Joi.object({
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

    return schema.validate(loginObject)
}



// Exporting the UserModel, validateUser, and validateLogin functions for external use
module.exports.UserModel = UserModel
module.exports.validateUser = validateUser
module.exports.validateLogin = validateLogin
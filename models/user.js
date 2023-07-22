const mongoose = require("mongoose")
const Joi = require("joi")
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")


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
 * a method to send a verification email to the user
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

    // creating a verification token
    const verificationToken = jwt.sign({email: this.email},
        process.env.JWT_PRIVATE_KEY, {expiresIn: "1d"})

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

    // sending the email
    await transporter.sendMail(mailOptions);
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
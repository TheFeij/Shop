const mongoose = require("mongoose")
const Joi = require("joi")


// defining product schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 50,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 1024,
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
}, {timestamps: true})

// creating our product model
const ProductModel = mongoose.model("product", productSchema)


/**
 * a function to validate the product object received from the client
 * in the process of adding a new product
 * @param productObject product object to be validated
 * @return {Joi.ValidationResult<any>}
 */
function validateProduct(productObject){
    const schema = Joi.object({
        title: Joi
            .string()
            .required()
            .min(1)
            .max(50),
        description: Joi
            .string()
            .required()
            .min(1)
            .max(1024),
    })

    return schema.validate(productObject)
}


module.exports.ProductModel = ProductModel
module.exports.validateProduct = validateProduct
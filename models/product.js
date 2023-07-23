const mongoose = require("mongoose")  // Mongoose for MongoDB interactions
const Joi = require("joi")            // Joi for data validation



// Defining product schema
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

// Creating the product model using productSchema
const ProductModel = mongoose.model("product", productSchema)



/**
 * Validates the product object received from the client when adding a new product.
 *
 * @param {Object} productObject - The product object to be validated.
 * @return {Joi.ValidationResult<any>} - The validation result using the Joi schema.
 */
function validateProduct(productObject){
    if(productObject === undefined){
        const error = new Joi.ValidationError("productObject cannot be undefined")
        error.stack = null
        return {
            error: error
        }
    }

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



// Exporting the Mongoose ProductModel and the validateProduct function for external use.
// Other parts of the application can access these functions through this module.
module.exports.ProductModel = ProductModel
module.exports.validateProduct = validateProduct
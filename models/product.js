const mongoose = require("mongoose")


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
        maxLength: 255,
    },
})

// creating our product model
const ProductModel = mongoose.model("product", productSchema)


module.exports.ProductModel = ProductModel
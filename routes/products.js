const _ = require("lodash")                                            // Lodash library for utility functions
const express = require("express")                                     // Express framework
const router = express.Router()                                        // Creating an Express router instance
const asyncMiddleware = require("../middlewares/async")                // Middleware for handling asynchronous routes
const auth = require("../middlewares/auth")                            // Middleware for user authentication
const { ProductModel, validateProduct } = require("../models/product") // Functions from the 'product' model module




/**
 * Retrieves products and handles pagination based on the request parameters.
 *
 * This route handler is responsible for retrieving products from the database and handling pagination
 * based on the request parameters. The handler requires authentication using the 'auth' middleware before
 * processing the request. It supports pagination with parameters for the page number ('pageNumber') and
 * page size ('pageSize'), sorting products based on the 'newToOld' parameter, and retrieving all products
 * regardless of the owner using the 'all' parameter. Products are sorted based on their creation date ('createdAt')
 * in ascending or descending order. If 'all' is set to true, all products are returned, and if it's false,
 * only products belonging to the authenticated user (ownerID matches the authenticated user's ID) are returned.
 */
router.get("/", auth, asyncMiddleware(async (req, res) => {
    // Getting required parameters for the pagination
    const pageNumber = req.query.pageNumber || 1
    const pageSize = req.query.pageSize || 10
    const sortOption = req.query.newToOld ? -1 : 1
    const all = req.query.all ? 1 : 0

    let products
    if(all){
        products = await ProductModel.find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({createdAt: sortOption})
            .select("-updatedAt")
    } else {
        products = await ProductModel.find({
            ownerID: req.user.id
        })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({createdAt: sortOption})
            .select("-updatedAt")
    }

    // Sending documents requested page to the user
    res.json(products)
}))

/**
 * Adds a new product to the database.
 *
 * This route handler is responsible for adding a new product to the database. It requires authentication
 * using the 'auth' middleware before processing the request. The handler first validates the product information
 * provided by the client using the 'validateProduct' function. If there are any validation errors, an error response
 * with the specific error message is sent. If the validation is successful, the product document is created using the
 * validated information and the authenticated user's ID as the owner. The product is then saved to the database,
 * and a success message is sent back to the client.
 */
router.post("/", auth, asyncMiddleware(async (req, res) => {
    // validate product information provided by the client
    const {error} = validateProduct(
        _.pick(req.body, ["title", "description"])
    )
    if(error){
        res.status(400).send(error.details[0].message)
    }

    // creating the product document
    const product = new ProductModel({
        title: req.body.title,
        description: req.body.description,
        ownerID: req.user.id
    })

    // saving product to the database and sending a message to the client
    await product.save()
    res.send("product added successfully!")
}))



// Exporting the router to be used in other parts of the application
module.exports = router
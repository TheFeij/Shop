const _ = require("lodash")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const asyncMiddleware = require("../middlewares/async")
const {validateUser, UserModel} = require("../models/user");
const auth = require("../middlewares/auth")
const {ProductModel, validateProduct} = require("../models/product");


router.post("/", auth, asyncMiddleware(async (req, res) => {

    // first finding user
    const user = await UserModel.findById(req.user.id)

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

    // starting a mongoose session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await session.withTransaction(async () => {
            // saving the product
            await product.save()
            // updating user document and adding the new product to it
            user.products.push(_.pick(product, ["title", "description", "createdAt"]))
            // saving updated user to the database
            await user.save()
        });

        // commit the transaction
        await session.commitTransaction();
        // end the Session
        session.endSession();
    } catch (error) {
        // abort the transaction in case of an error
        await session.abortTransaction();
        session.endSession();
        return res.status(500).send("saving the product failed")
    }

    res.send("product added successfully!")
}))


module.exports = router
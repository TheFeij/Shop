const _ = require("lodash")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const asyncMiddleware = require("../middlewares/async")
const {UserModel} = require("../models/user");
const auth = require("../middlewares/auth")
const {ProductModel, validateProduct} = require("../models/product");


router.get("/", auth, asyncMiddleware(async (req, res) => {

    // getting required parameters for the pagination
    const pageNumber = req.query.pageNumber | 1
    const pageSize = req.query.pageSize | 10
    const sortOption = req.query.newToOld ? -1 : 1

    let products
    if(req.query.all){
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

    // sending documents requested page to the user
    res.json(products)
}))

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


module.exports = router
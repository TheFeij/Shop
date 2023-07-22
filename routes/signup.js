const express = require("express")
const router = express.Router()
const asyncMiddleware = require("../middlewares/async")


router("/", asyncMiddleware((req, res) => {

}))
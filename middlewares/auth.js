const jwt = require("jsonwebtoken")    // Module for working with JSON Web Tokens (JWT)



/**
 * Middleware function to authenticate and authorize users using JWT (JSON Web Token).
 * Reads the token from the request's header, verifies it, and saves the decoded user
 * object in req.user. If the token is valid, the function calls the next middleware in
 * the chain. If the token is invalid or not provided, it sends an appropriate error response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Callback to call the next middleware function in the chain.
 * @returns {void}
 */
module.exports =  function(req, res, next){
    // Read token from the request's header
    const token = req.header("x-access-token")
    if(!token){
        res.status(401).send("access denied. no token provided")
    } else {
        // Verify the provided access token and save the decoded object in req.user
        try {
            req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
            // Call the next middleware function
            next()
        } catch(exception){
            res.status(400).send("invalid token")
        }
    }
}
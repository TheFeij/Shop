const jwt = require("jsonwebtoken");

module.exports =  function(req, res, next){

    // read token from the request's header
    const token = req.header("x-access-token")
    if(!token){
        return res.status(401).send("access denied. no token provided")
    }

    // verify the provided access token
    try {
        req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        next()
    } catch(exception){
        res.status(400).send("invalid token")
    }

}
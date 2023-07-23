const winston = require("winston")      // Import Winston for logging



/**
 * Middleware function to wrap all route handlers in a try-catch block
 * to handle exceptions and errors, so that we don't have to repeat the
 * try-catch pattern in all our route handlers.
 *
 * @param {function} handler - Function that handles an endpoint (route handler).
 * @return {function(*, *, *)} - A new async function to be used as a wrapped route handler.
 */
module.exports = function(handler){
    return async (req, res) => {
        try{
            await handler(req, res)
        } catch (ex){
            winston.error(ex.message, ex)
        }
    }
}

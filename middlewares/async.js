const winston = require("winston")

/**
 * a middleware function to wrap all route handlers in a try catch
 * block and handle the exceptions and error so that we don't have to
 * repeat a try catch pattern in all our route handlers
 * @param handler function that handles an end point
 * @return {(function(*, *, *): Promise<void>)|*}
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

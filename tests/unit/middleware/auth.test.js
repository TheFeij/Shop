require('dotenv').config()
const {UserModel} = require("../../../models/user")
const authTest = require("../../../middlewares/auth")


// Note that here we only test the happy path. Other possible paths are tested
// in the integration test for this function
describe("auth", () => {
    // Creating a test user object
    const user = new UserModel({
        firstname: "firstname",
        lastname: "lastname",
        email: "test@email.com",
        password: "password",
    });

    it("should populate req.user with the payload of a valid JWT", () => {
        // Generating a valid access token
        const accessToken = user.generateAccessToken()

        // mocks:
        const req = {
            header: jest.fn().mockReturnValue(accessToken)
        }
        const res = {}
        const next = jest.fn()

        // calling the function
        authTest(req, res, next)
        console.log(req.user)

        expect(req.user).toMatchObject({id: user._id.toString()})
    })

})
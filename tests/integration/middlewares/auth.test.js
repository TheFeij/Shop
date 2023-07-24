const request = require("supertest")
const {UserModel} = require("../../../models/user");



let server
let user
let accessToken



describe("auth", () => {
    beforeEach(async () => {
        // Creating the server
        server = require("../../../index")

        // Creating a test user object
        user = new UserModel({
            firstname: "firstname1",
            lastname: "lastname1",
            email: "test1@email.com",
            password: "password1",
            isVerified: true
        })

        // saving the test user to the database
        await user.save()
    })
    afterEach(async () => {
        server.close()
        await UserModel.deleteMany()
    })

    const sendRequest = () => {
        return request(server)
            .get("/products")
            .set("x-access-token", accessToken)
    }
    const setValidAccessToken = () => {
        // generating an access token
        accessToken = user.generateAccessToken()
    }

    it("should return 401 if no access token is provided", async () => {
        accessToken = ""    // we cannot send null, cause set function will convert it to a string

        // Sending the request without providing an access token
        const result = await sendRequest()

        // Expecting the result to be 401 (no token provided)
        expect(result.status).toBe(401)
    })

    it("should return 400 if invalid access token is provided", async () => {
        // Set an invalid access token
        accessToken = "invalid access token"

        // Sending the request
        const result = await sendRequest()

        // Expecting the result status to be 400 (invalid token)
        expect(result.status).toBe(400)
    })

    it("should return 200 if token is valid", async () => {
        // Setting a valid access token
        setValidAccessToken()

        // Sending the request
        const result = await sendRequest()

        // expecting the status to be 200
        expect(result.status).toBe(200)
    })
})
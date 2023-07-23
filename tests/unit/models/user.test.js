require('dotenv').config();
const jwt = require("jsonwebtoken")
const {UserModel, validateUser} = require("../../../models/user")
const bcrypt = require("bcrypt")



// Creating a test user object
const user = new UserModel({
    firstname: "firstname",
    lastname: "lastname",
    email: "test@email.com",
    password: "password",
});



describe("generateAccessToken", () => {

    it("should return a valid JWT with correct payload", () => {
        // Generating an access token
        const accessToken = user.generateAccessToken()

        // Verifying the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY)

        // Expecting the decoded token to contain the user's _id as a string
        expect(decoded).toMatchObject({ id: user._id.toString() })
    })

    it("should return a valid JWT with the correct expiration time", () => {
        // Generating the access token using the method
        const accessToken = user.generateAccessToken()

        // Verifying the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY);

        // Access token should expire in 10 minutes
        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = decoded.exp;

        // Expecting the expiration time to be 10 minutes
        expect(expirationTime).toBeGreaterThan(currentTime);
        expect(expirationTime).toBeCloseTo(currentTime + 10 * 60);
    })
})

describe("generateRefreshToken", () => {

    it("should return a valid JWT with correct payload", () => {
        // Generating a refresh token
        const refreshToken = user.generateRefreshToken()

        // Verifying the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY)

        // Expecting the decoded token to contain the user's _id as a string
        expect(decoded).toMatchObject({ id: user._id.toString() })
    })

    it("should return a valid JWT with the correct expiration time", () => {
        // Generating the refresh token using the method
        const refreshToken = user.generateRefreshToken()

        // Verifying the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY)

        // Refresh token should expire in 12 hours
        const currentTime = Math.floor(Date.now() / 1000)
        const expirationTime = decoded.exp

        // Expecting the expiration time to be 12 hours
        expect(expirationTime).toBeGreaterThan(currentTime)
        expect(expirationTime).toBeCloseTo(currentTime + 12 * 60 * 60)
    })
})

describe("hashPassword", () => {

    it("should hash password correctly", async () => {
        // getting the original password
        const plainTextPassword = user.password
        // hashing user.password, so from now on user.password is hashed
        await user.hashPassword()

        // Check if the original password and the hashed one are the same or not
        const result = await bcrypt.compare(plainTextPassword, user.password)

        // expect the result to be true
        expect(result).toBe(true)
    })
})

describe("validateUser", () => {
    it("should return the input object if it is valid", () => {
        const user = {
            firstname: "firstname",
            lastname: "lastname",
            email: "email@test.com",
            password: "password"
        }

        // validating user object
        const result = validateUser(user)

        // expect result.value to match user
        expect(result.value).toMatchObject(user)
        // expect result.error to be undefined
        expect(result.error).toBeUndefined()
    })

    it.each([
        {},
        null,
        undefined,
        {
            firstname: "f",
            lastname: "lastname",
            email: "email@test.com",
            password: "password"
        },
        {
            firstname: "firstname",
            lastname: "l",
            email: "email@test.com",
            password: "password"
        },
        {
            firstname: "firstname",
            lastname: "lastname",
            email: "test.com",
            password: "password"
        },
        {
            firstname: "firstname",
            lastname: "lastname",
            email: "email@test.com",
            password: "pass"
        }
    ])("should return an error object if input object is not valid", (user) => {
        // validate user object
        const result = validateUser(user)

        // expect to have a defined error property in the result
        expect(result.error).toBeDefined()
    })
})

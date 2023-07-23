require('dotenv').config();
const jwt = require("jsonwebtoken")
const {UserModel} = require("../../../models/user")



describe("generateAccessToken", () => {
    // Creating a test user object
    const user = new UserModel({
        firstname: "firstname",
        lastname: "lastname",
        email: "test@email.com",
        password: "password",
    });

    it("should return a valid JWT with correct payload", () => {
        // Generating an access token
        const accessToken = user.generateAccessToken();

        // Verifying the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY);

        // Expecting the decoded token to contain the user's _id as a string
        expect(decoded).toMatchObject({ id: user._id.toString() });
    })

    it("should return a valid JWT with the correct expiration time", () => {
        // Generating the access token using the method
        const accessToken = user.generateAccessToken();

        // Verifying the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY);

        // Access token should expire in 10 minutes
        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = decoded.exp;

        // Expecting the expiration time to be 10 minutes
        expect(expirationTime).toBeGreaterThan(currentTime);
        expect(expirationTime).toBeCloseTo(currentTime + 10 * 60);
    })

    it.each([
        null,
        undefined,
        NaN,
        false,
        0,
        "",])
    ("should throw an error for invalid input: %p", (invalidInput) => {
        // Calling the method with invalid input should throw an error
        expect(() => {
            UserModel.generateAccessToken(invalidInput);
        }).toThrow();
    });
})

describe("generateRefreshToken", () => {
    // Creating a test user object
    const user = new UserModel({
        firstname: "firstname",
        lastname: "lastname",
        email: "test@email.com",
        password: "password",
    });

    it("should return a valid JWT with correct payload", () => {
        // Generating a refresh token
        const refreshToken = user.generateRefreshToken();

        // Verifying the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY);

        // Expecting the decoded token to contain the user's _id as a string
        expect(decoded).toMatchObject({ id: user._id.toString() });
    })

    it("should return a valid JWT with the correct expiration time", () => {
        // Generating the refresh token using the method
        const refreshToken = user.generateRefreshToken();

        // Verifying the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY);

        // Refresh token should expire in 12 hours
        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = decoded.exp;

        // Expecting the expiration time to be 12 hours
        expect(expirationTime).toBeGreaterThan(currentTime);
        expect(expirationTime).toBeCloseTo(currentTime + 12 * 60 * 60);
    })

    it.each([
        null,
        undefined,
        NaN,
        false,
        0,
        "",])
    ("should throw an error for invalid input: %p", (invalidInput) => {
        // Calling the method with invalid input should throw an error
        expect(() => {
            UserModel.generateRefreshToken(invalidInput);
        }).toThrow();
    });
})


const request = require("supertest")
const {ProductModel} = require("../../../models/product");
const {UserModel} = require("../../../models/user");



let server
let user1, user2
let accessToken



describe("/products", () => {
    beforeEach(async () => {
        server = require("../../../index")
        // Creating two test user objects
        user1 = new UserModel({
            firstname: "firstname1",
            lastname: "lastname1",
            email: "test1@email.com",
            password: "password1",
            isVerified: true
        })
        user2 = new UserModel({
            firstname: "firstname2",
            lastname: "lastname2",
            email: "test2@email.com",
            password: "password2",
            isVerified: true
        })

        // saving test users to the database
        await user1.save()
        await user2.save()

        // Populating database with test data
        const product1 = new ProductModel({
            title: "product1",
            description: "description1",
            ownerID: user1._id
        })
        const product2 = new ProductModel({
            title: "product2",
            description: "description2",
            ownerID: user2._id
        })
        const product3 = new ProductModel({
            title: "product3",
            description: "description3",
            ownerID: user1._id
        })
        const product4 = new ProductModel({
            title: "product4",
            description: "description4",
            ownerID: user1._id
        })

        await product1.save()
        await product2.save()
        await product3.save()
        await product4.save()
    })
    afterEach(async () => {
        server.close()
        await UserModel.deleteMany()
        await ProductModel.deleteMany()
    })

    const sendGetRequest = () => {
        return request(server)
            .get("/products")
            .set("x-access-token", accessToken)
    }
    const setValidAccessToken = () => {
        // generating an access token
        accessToken = user1.generateAccessToken()
    }

    describe("GET /", () => {
        it("should return 401 if no access token is provided", async () => {
            accessToken = ""

            // Sending the request without providing an access token
            const result = await sendGetRequest()

            // Expecting the result to be 401 (no token provided)
            expect(result.status).toBe(401)
        })

        it("should return 400 if invalid access token is provided", async () => {
            // Set an invalid access token
            accessToken = "invalid access token"

            // Sending the request
            const result = await sendGetRequest()

            // Expecting the result status to be 400 (invalid token)
            expect(result.status).toBe(400)
        })

        it("should return user products from old to new if all parameters have default value", async () => {
            // Setting a valid access token
            setValidAccessToken()

            // Sending the request
            const result = await sendGetRequest()

            expect(result.status).toBe(200)
            expect(result.body.length).toBe(3)
            // Expecting docs to be sorted from old to new
            expect(result.body[0]).toMatchObject({
                    title: "product1",
                    description: "description1",
                    ownerID: user1._id.toString()
                })
            expect(result.body[1]).toMatchObject({
                    title: "product3",
                    description: "description3",
                    ownerID: user1._id.toString()
                })
            expect(result.body[2]).toMatchObject({
                    title: "product4",
                    description: "description4",
                    ownerID: user1._id.toString()
                })
        })

        it("should return all the products from old to new if query parameter all=true", async () => {
            // Setting a valid access token
            setValidAccessToken()

            // Sending the request
            const result = await request(server)
                .get("/products")
                .set("x-access-token", accessToken)
                .query({all: true})

            expect(result.status).toBe(200)
            expect(result.body.length).toBe(4)
            // Expecting docs to be sorted from old to new
            expect(result.body[0]).toMatchObject({
                title: "product1",
                description: "description1",
                ownerID: user1._id.toString()
            })
            expect(result.body[1]).toMatchObject({
                title: "product2",
                description: "description2",
                ownerID: user2._id.toString()
            })
            expect(result.body[2]).toMatchObject({
                title: "product3",
                description: "description3",
                ownerID: user1._id.toString()
            })
            expect(result.body[3]).toMatchObject({
                title: "product4",
                description: "description4",
                ownerID: user1._id.toString()
            })
        })

        it("should return all the products sorted from new to old if query parameter newToOld=true", async () => {
            // Setting a valid access token
            setValidAccessToken()

            // Sending the request
            const result = await request(server)
                .get("/products")
                .set("x-access-token", accessToken)
                .query({all: true, newToOld: true})

            expect(result.status).toBe(200)
            expect(result.body.length).toBe(4)
            // results must be all documents sorted new to old
            expect(result.body[3]).toMatchObject({
                title: "product1",
                description: "description1",
                ownerID: user1._id.toString()
            })
            expect(result.body[2]).toMatchObject({
                title: "product2",
                description: "description2",
                ownerID: user2._id.toString()
            })
            expect(result.body[1]).toMatchObject({
                title: "product3",
                description: "description3",
                ownerID: user1._id.toString()
            })
            expect(result.body[0]).toMatchObject({
                title: "product4",
                description: "description4",
                ownerID: user1._id.toString()
            })
        })

        it("should return 400 if query parameters pageSize and pageNumber < 1", async () => {
            // Setting a valid access token
            setValidAccessToken()

            // Sending the request
            const result = await request(server)
                .get("/products")
                .set("x-access-token", accessToken)
                .query({all: true, newToOld: true, pageSize: 0, pageNumber: 0})

            expect(result.status).toBe(400)
        })

        it("should paginate the result if query parameters pageSize and pageNumber are set and valid", async () => {
            // Setting a valid access token
            setValidAccessToken()

            // Sending the request
            const result = await request(server)
                .get("/products")
                .set("x-access-token", accessToken)
                .query({all: true, newToOld: true, pageSize: 2, pageNumber: 1})

            expect(result.status).toBe(200)
            // results must be the first page of all documents sorted new to old
            expect(result.body[1]).toMatchObject({
                title: "product3",
                description: "description3",
                ownerID: user1._id.toString()
            })
            expect(result.body[0]).toMatchObject({
                title: "product4",
                description: "description4",
                ownerID: user1._id.toString()
            })
        })
    })

    describe("POST /", () => {
        it("should return 401 if no access token is provided", async () => {
            accessToken = ""

            // Sending the request without providing an access token
            const result = await request(server)
                .post("/products")
                .set("x-access-token", accessToken)

            // Expecting the result to be 401 (no token provided)
            expect(result.status).toBe(401)
        })

        it("should return 400 if invalid access token is provided", async () => {
            // Set an invalid access token
            accessToken = "invalid access token"

            // Sending the request
            const result = await request(server)
                .post("/products")
                .set("x-access-token", accessToken)

            // Expecting the result status to be 400 (invalid token)
            expect(result.status).toBe(400)
        })

        it.each([
            {},
            null,
            undefined,
            {
                title: "",
                description: "description"
            },
            {
                title: "title",
                description: ""
            }
        ])
        ("should return 400 if provided product object is not valid", async (input) => {
            // Setting a valid access token
            setValidAccessToken()

            // Sending the request
            const result = await request(server)
                .post("/products")
                .set("x-access-token", accessToken)
                .send(input)

            expect(result.status).toBe(400)
        })

        it("should save product to the database if valid", async () => {
            // Setting a valid access token
            setValidAccessToken()

            // creating a productObject
            const productObject = {
                title: "product5",
                description: "description5",
                ownerID: user1._id
            }

            // Sending the request
            await request(server)
                .post("/products")
                .set("x-access-token", accessToken)
                .send(productObject)

            // Retrieving the added product from the database
            const product = await ProductModel.find({
                ownerID: user1._id,
                title: "product5",
                description: "description5"
            })

            // expecting the saved product to match productObject
            expect(product[0]).toMatchObject(productObject)
        })
    })
})
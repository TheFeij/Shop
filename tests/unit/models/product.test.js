const {validateProduct} = require("../../../models/product");



describe("validateProduct", () => {
    it("should return the input object if it is valid", () => {
        const product = {
            title: "title",
            description: "description"
        }

        // validating product object
        const result = validateProduct(product)

        // expect result.value to match product
        expect(result.value).toMatchObject(product)
        // expect result.error to be undefined
        expect(result.error).toBeUndefined()
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
    ])("should return an error object if input object is not valid", (product) => {
        // validate product object
        const result = validateProduct(product)

        // expect to have a defined error property in the result
        expect(result.error).toBeDefined()
    })
})
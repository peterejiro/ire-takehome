const { describe, it, xit, test } = require("@jest/globals")
const request = require('supertest')
const app = require('../app');
const customer = require('../services/customerService')

beforeEach(async () => {
    await customer.removeCustomerByEmail('john.doe@ire.com');
});
describe("POST /customer", () => {
    describe("given all parameters", () => {

        test("should respond with a 200 status code", async () => {
            const response = await request(app).post("/customer").send({
                c_first_name: "John",
                c_last_name: "Doe",
                c_phone: "08090000000",
                c_email: "john.doe@ire.com"

            })
            expect(response.statusCode).toBe(200)
        })
        test("should specify json in the content type header", async () => {
            const response = await request(app).post("/customer").send({
                c_first_name: "John",
                c_last_name: "Doe",
                c_phone: "08090000000",
                c_email: "john.doe@ire.com"
            })
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
        test("response has c_id", async () => {
            const response = await request(app).post("/customer").send({
                c_first_name: "John",
                c_last_name: "Doe",
                c_phone: "08090000000",
                c_email: "john.doe@ire.com"
            })
            expect(response.body).toEqual('Customer Added Successful')

        })
    })

    describe("some parameters are missing", () => {
        test("should respond with a status code of 400", async () => {
            const bodyData = [
                {c_first_name: "John"},
                {c_last_name: "Doe"},
                {c_phone: "08090000000"},
                {c_email: "john.doe@ire.com"}
            ]
            for (const body of bodyData) {
                const response = await request(app).post("/customer").send(body)
                expect(response.statusCode).toBe(400)
            }
        })
    })

})

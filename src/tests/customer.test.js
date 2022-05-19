const { describe, it, xit, test } = require("@jest/globals")
const request = require('supertest')
const app = require('../app');
const customer = require('../services/customerService')

afterEach(async () => {
    await customer.removeCustomerByEmail('john.doe@ire.com');
});

beforeEach(async () => {
    await customer.removeCustomerByEmail('john.doe@ire.com');
});
describe("Customer Function", () => {
    test('Add Customer', async () => {
        const data =  {c_first_name: "John",
            c_last_name: "Doe",
            c_phone: "08090000000",
            c_email: "john.doe@ire.com"
        }
        const customerAddResponse = await customer.addCustomer(data).then((data)=>{
            return data
        })

        expect(customerAddResponse.c_email).toEqual('john.doe@ire.com');
    })

})

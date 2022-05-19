const { describe, it, xit, test } = require("@jest/globals")
const app = require('../app');
const payment = require('../services/paymentService')

afterEach(async () => {
    await payment.removePaymentByTxnId('ire-test');
});

beforeEach(async () => {
    await payment.removePaymentByTxnId('ire-test');
});
describe("Payment Function", () => {
    test('Add Payment', async () => {
        const data =  {
            p_customer_id: 1,
            p_transaction_id: 'ire-test',
            p_amount: 5000,
            p_status: 1
        }
        const paymentAddResponse = await payment.addPayment(data).then((data)=>{
            return data
        })

        expect(paymentAddResponse.p_transaction_id).toEqual('ire-test');
    })

})

const Joi = require('joi')
const express = require('express');
const router = express.Router();
const customerService = require('../services/customerService');
const paymentService = require('../services/paymentService');
const dotenv = require('dotenv');
const _ = require('lodash')
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

router.post('/:customerId', async function (req, res, next) {
    try {
        const schema = Joi.object({
            cardNumber: Joi.string().required(),
            cvv: Joi.string().required(),
            expiryMonth: Joi.number().required(),
            expiryYear: Joi.number().required(),
            amount: Joi.number().precision(2).required(),
            pin: Joi.number().required()
        })
        const paymentRequest = req.body
        const validationResult = schema.validate(paymentRequest)
        if (validationResult.error) {
            return res.status(400).json(validationResult.error.details[0].message)
        }
        const checkExistingCustomer = await customerService.getCustomerById(req.params['customerId']).then((data) => {
            return data
        })
        if (_.isEmpty(checkExistingCustomer)) {
            return res.status(400).json('Customer Does Not exists')
        }

        const txnRef = 'ire' + Math.floor(Date.now())
        const payload = {
            "card_number": paymentRequest.cardNumber,
            "cvv": paymentRequest.cvv,
            "expiry_month": paymentRequest.expiryMonth,
            "expiry_year": paymentRequest.expiryYear,
            "currency": "NGN",
            "amount": paymentRequest.amount,
            "redirect_url": "https://www.google.com",
            "fullname": `${checkExistingCustomer.c_first_name} ${checkExistingCustomer.c_last_name}`,
            "email": checkExistingCustomer.c_email,
            "phone_number": checkExistingCustomer.c_phone,
            "enckey": process.env.FLW_ENCRYPTION_KEY,
            "tx_ref": txnRef


        }

        const paymentResponse = await chargeCard(payload, paymentRequest.pin).then((data) => {
            return data
        })

        if (paymentResponse.status === 'success') {
            const paymentData = {
                p_customer_id: req.params['customerId'],
                p_transaction_id: txnRef,
                p_amount: paymentRequest.amount,
                p_status: 1
            }
            const paymentSuccessResponse = await paymentService.addPayment(paymentData).then((data) => {
                return data
            })

            paymentData.p_status = "successful"

            return res.status(200).json( paymentData)

        }else{
            const paymentData = {
                p_customer_id: req.params['customerId'],
                p_transaction_id: txnRef,
                p_amount: paymentRequest.amount,
                p_status: 0
            }
            const paymentFailureResponse = await paymentService.addPayment(paymentData).then((data) => {
                return data
            })
            paymentData.p_status = "failed"
            return res.status(400).json(paymentData)
        }

    } catch (err) {
        return res.status(400).json(`Error while adding customer ${err.message}`)
    }
});

router.get('/:customerId', async function (req, res, next) {
    try {

        const checkExistingCustomer = await customerService.getCustomerById(req.params['customerId']).then((data) => {
            return data
        })
        if (_.isEmpty(checkExistingCustomer)) {
            return res.status(400).json('Customer Does Not exists')
        }

        const customerPayments = await paymentService.getPaymentsByCustomer(req.params['customerId']).then((data)=>{
            return data
        })

        return res.status(200).json(customerPayments)


    } catch (err) {
        return res.status(400).json(`Error while adding customer ${err.message}`)
    }
});

async function chargeCard(payload, pin) {
    try {
        const response = await flw.Charge.card(payload)
        console.log(response)
        if (response.meta.authorization.mode === 'pin') {
            let payload2 = payload
            payload2.authorization = {
                "mode": "pin",
                "fields": [
                    "pin"
                ],
                "pin": pin
            }
            const reCallCharge = await flw.Charge.card(payload2)

            const callValidate = await flw.Charge.validate({
                "otp": "12345",
                "flw_ref": reCallCharge.data.flw_ref
            })
            console.log(callValidate)

        }
        return (response)
    } catch (error) {
        console.log(error)
    }
}


module.exports = router;

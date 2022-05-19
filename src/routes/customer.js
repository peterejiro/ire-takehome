const Joi = require('joi')
const express = require('express');
const router = express.Router();
const customerService = require('../services/customerService');
//const paymentService =  require('../services/payment');
const _ = require('lodash')

router.get('/', async function (req, res, next) {
    try {
        const customers = await customerService.getAllCustomers().then((data) => {
            return data
        })
        return res.status(200).json(customers)

    } catch (err) {
        return res.status(400).json(`Error while fetching customers ${err.message}`)
    }
});

router.post('/', async function (req, res, next) {
    try {
        const schema = Joi.object({
            c_first_name: Joi.string().required(),
            c_last_name: Joi.string().required(),
            c_email: Joi.string().required(),
            c_phone: Joi.string().required()
        })
        const customerRequest = req.body
        const validationResult = schema.validate(customerRequest)
        if (validationResult.error) {
            return res.status(400).json(validationResult.error.details[0].message)
        }
        const checkExistingCustomer = await customerService.getCustomerByEmail(customerRequest.c_email).then((data)=>{
            return data
        })
        if(checkExistingCustomer){
            return res.status(400).json('Customer already exists')
        }
        const customerAddResponse = await customerService.addCustomer(customerRequest).then((data) => {
            return data
        })
        if (_.isEmpty(customerAddResponse) || _.isNull(customerAddResponse)) {
            return res.status(400).json('An error occurred while adding customer')
        }
        return res.status(200).json('Customer Added Successful')

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

        return res.status(200).json(checkExistingCustomer)

    } catch (err) {
        return res.status(400).json(`Error while adding customer ${err.message}`)
    }
});


module.exports = router;

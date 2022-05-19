const { QueryTypes } = require('sequelize')
const { sequelize, Sequelize } = require('./db');
const customer = require("../models/customer")(sequelize, Sequelize.DataTypes)

async function addCustomer(customerData){
    return  await customer.create({
        c_first_name: customerData.c_first_name,
        c_last_name: customerData.c_last_name,
        c_email: customerData.c_email,
        c_phone: customerData.c_phone
    });
}

async function getAllCustomers(){
    return await customer.findAll();
}

async function getCustomerByEmail(customerEmail){
    return await customer.findOne({where: {c_email: customerEmail}})
}

async function getCustomerById(customerId){
    return await customer.findOne({where: {c_id: customerId},
        include: ['payments']
    })
}

async function removeCustomerByEmail(customerEmail){
    return await customer.destroy({where:{c_email: customerEmail}})
}

module.exports = {
    addCustomer,
    getCustomerById,
    getCustomerByEmail,
    getAllCustomers,
    removeCustomerByEmail
}

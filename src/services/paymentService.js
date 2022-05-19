const { QueryTypes } = require('sequelize')
const { sequelize, Sequelize } = require('./db');
const payment = require("../models/payment")(sequelize, Sequelize.DataTypes)

async function addPayment(paymentData){
    return  await payment.create({
        p_customer_id: paymentData.p_customer_id,
        p_transaction_id: paymentData.p_transaction_id,
        p_amount: paymentData.p_amount,
        p_status: paymentData.p_status
    });
}

async function getPaymentsByCustomer(customerId){
    return await payment.findAll({where: {p_customer_id: customerId }})
}

async function removePaymentByTxnId(txnId){
    return await payment.destroy({where:{p_transaction_id: txnId}})
}




module.exports = {
    addPayment,
    getPaymentsByCustomer,
    removePaymentByTxnId
}

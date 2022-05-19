'use strict';
const {sequelize, Sequelize} = require("../services/db");
const {
  Model
} = require('sequelize');
const paymentModel = require("../models/payment")(sequelize, Sequelize.DataTypes)
module.exports = (sequelize, DataTypes) => {
  class customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  customer.init({
    c_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    c_first_name: DataTypes.STRING,
    c_last_name: DataTypes.STRING,
    c_email: DataTypes.STRING,
    c_phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customer',
    tableName: 'customers'
  });

  customer.belongsTo(paymentModel, { as: 'payments', foreignKey: 'c_id'})
  customer.hasMany(paymentModel, {foreignKey: 'p_customer_id'})

  return customer;
};
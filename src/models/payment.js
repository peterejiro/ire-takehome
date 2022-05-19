'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  payment.init({
    p_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    p_customer_id: DataTypes.INTEGER,
    p_transaction_id: DataTypes.STRING,
    p_amount: DataTypes.DOUBLE,
    p_status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'payment',
    tableName: 'payments'

  });
  return payment;
};
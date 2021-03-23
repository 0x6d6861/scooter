const {sequelize} = require("../database");
const { Sequelize, Model, DataTypes } = require('sequelize');
class Scooter extends Model {}

Scooter.init({
    imei: { type: DataTypes.STRING, unique: true },
    qr: { type: DataTypes.STRING, unique: true } // TODO you can make this autogenerated
}, { sequelize, modelName: 'scooters' });

module.exports = Scooter;

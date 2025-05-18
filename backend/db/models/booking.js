'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // A Booking belongs to a Spot
      Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
      // A Booking belongs to a User
      Booking.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: 'startDate must be a valid date' }
        }
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: 'endDate must be a valid date' }
        }
      }
    },
    {
      sequelize,
      modelName: 'Booking'
    }
  );
  return Booking;
};
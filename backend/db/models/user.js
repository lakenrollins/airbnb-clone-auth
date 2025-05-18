'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associations
      User.hasMany(models.Spot, { foreignKey: 'ownerId', onDelete: 'CASCADE', hooks: true });
      User.hasMany(models.Review, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
      // A User has many Bookings
      User.hasMany(models.Booking, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });

    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  );
  return User;
};



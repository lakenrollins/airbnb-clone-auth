



'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' });
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
    }
  }

  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        },
        validate: {
          notNull: { msg: 'Owner ID is required' },
          isInt: { msg: 'Owner ID must be an integer' },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        },
        validate: {
          notNull: { msg: 'Address is required' },
          notEmpty: { msg: 'Address cannot be empty' },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        },
        validate: {
          notNull: { msg: 'City is required' },
          notEmpty: { msg: 'City cannot be empty' },
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        },
        validate: {
          notNull: { msg: 'State is required' },
          notEmpty: { msg: 'State cannot be empty' },
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        },
        validate: {
          notNull: { msg: 'Country is required' },
          notEmpty: { msg: 'Country cannot be empty' },
        },
      },
      lat: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
        references: {
          model: 'Spots',
          key: 'id'
        },
        validate: {
          // notNull: { msg: 'Latitude is required' },
          isDecimal: { msg: 'Latitude must be a decimal number' },
          min: { args: [-90], msg: 'Latitude must be between -90 and 90' },
          max: { args: [90], msg: 'Latitude must be between -90 and 90' },
        },
      },
      lng: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
        references: {
          model: 'Spots',
          key: 'id'
        },
        validate: {
          // notNull: { msg: 'Longitude is required' },
          isDecimal: { msg: 'Longitude must be a decimal number' },
          min: { args: [-180], msg: 'Longitude must be between -180 and 180' },
          max: { args: [180], msg: 'Longitude must be between -180 and 180' },
        },
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        },
        validate: {
          notNull: { msg: 'Name is required' },
          notEmpty: { msg: 'Name cannot be empty' },
          len: { args: [1, 50], msg: 'Name must be between 1 and 50 characters' },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        },
        validate: {
          notNull: { msg: 'Description is required' },
          notEmpty: { msg: 'Description cannot be empty' },
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        },
        validate: {
          notNull: { msg: 'Price is required' },
          isDecimal: { msg: 'Price must be a decimal number' },
          min: { args: [0], msg: 'Price must be a positive number' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );

  return Spot;
};

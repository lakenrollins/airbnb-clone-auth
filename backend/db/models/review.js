'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // A Review belongs to a Spot
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
      // A Review belongs to a User
      Review.belongsTo(models.User, { foreignKey: 'userId' });
      // A Review can have many ReviewImages
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId', onDelete: 'CASCADE', hooks: true });
    }
  }
  Review.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Review cannot be empty' }
        }
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [1], msg: 'Stars must be at least 1' },
          max: { args: [5], msg: 'Stars cannot be more than 5' }
        }
      }
    },
    {
      sequelize,
      modelName: 'Review'
    }
  );
  return Review;
};
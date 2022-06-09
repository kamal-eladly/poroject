"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class contactUs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      contactUs.belongsTo(models.users, {
        as: "contactUsUser",
        foreignKey: "userId",
      });
    }
  }
  contactUs.init(
    {
      userId: DataTypes.INTEGER,
      message: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "contactUs",
    }
  );
  return contactUs;
};

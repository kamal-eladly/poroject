"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class usersResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      usersResult.belongsTo(models.users, {
        as: "ResultUser",
        foreignKey: "userId",
      });
      usersResult.belongsTo(models.Testing, {
        as: "ResultTesting",
        foreignKey: "test",
      });
    }
  }
  usersResult.init(
    {
      userId: DataTypes.INTEGER,
      test: DataTypes.INTEGER,
      audio: DataTypes.STRING,
      success: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "usersResult",
    }
  );
  return usersResult;
};

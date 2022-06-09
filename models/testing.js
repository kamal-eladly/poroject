"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Testing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Testing.belongsTo(models.disability, {
        as: "TestingDisability",
        foreignKey: "disability",
      });
      Testing.hasOne(models.usersResult, {
        as: "TestingResult",
        foreignKey: "test",
      });
    }
  }
  Testing.init(
    {
      disability: DataTypes.INTEGER,
      exam: DataTypes.ARRAY(DataTypes.STRING),
      numberOfTest: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Testing",
    }
  );
  return Testing;
};

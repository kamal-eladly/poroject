"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class training extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      training.belongsTo(models.disability, {
        as: "trainingDisability",
        foreignKey: "disability",
      });
    }
  }
  training.init(
    {
      title: DataTypes.STRING,
      image: DataTypes.STRING,
      video: DataTypes.STRING,
      content: DataTypes.TEXT,
      disability: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "training",
    }
  );
  return training;
};

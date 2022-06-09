"use strict";
const { Op } = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      gender: DataTypes.BOOLEAN,
      Disability: DataTypes.ARRAY(DataTypes.INTEGER),
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      isDoctor: DataTypes.BOOLEAN,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "users",
      scopes: {
        isActive: {
          where: {
            active: {
              [Op.eq]: true,
            },
          },
        },
      },
    }
  );
  return users;
};

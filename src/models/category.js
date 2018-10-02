const createCategoryModel = (sequelize, DataTypes) =>
  sequelize.define("category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

export default createCategoryModel;

const createArticleModel = (sequelize, DataTypes) =>
  sequelize.define("article", {
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publish: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

export default createArticleModel;

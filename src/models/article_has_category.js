const createArticleHasCategoryModel = (sequelize, DataTypes) =>
  sequelize.define("article_has_category");

export default createArticleHasCategoryModel;

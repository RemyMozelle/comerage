const createCommentModel = (sequelize, DataTypes) =>
  sequelize.define("comment", {
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

export default createCommentModel;

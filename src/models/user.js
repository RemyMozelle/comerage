const createUserModel = (sequelize, DataTypes) =>
  sequelize.define("user", {
    nickname: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 255],
          msg: "vous devez avoir un minimum de 3 carractère"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "email que vous avez entrer existe déjà"
        }
      },
      unique: true
    }
  });

export default createUserModel;

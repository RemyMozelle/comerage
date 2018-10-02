import Sequelize from "sequelize";

const createSequelize = (
  MYSQL_DATABASE,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_HOST
) => {
  const sequelize = new Sequelize(
    MYSQL_DATABASE,
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
    {
      host: MYSQL_HOST,
      dialect: "mysql",
      operatorsAliases: false,
      define: {
        underscored: true,
        timestamps: false,
        freezeTableName: true
      }
    }
  );
  console.log(MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_HOST);
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch(err => {
      console.error("Can't connect to the database", err);
    });
  return sequelize;
};

export default createSequelize;

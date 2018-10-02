import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import passport from "passport";
import session from "express-session";
import bCrypt from "bcrypt-nodejs";
import { config } from "dotenv";
import createSequelize from "./database/db";
import { createAccount } from "./controllers/user/createAccount";
import {
  createArticleModel,
  createArticleHasCategoryModel,
  createCommentModel,
  createUserModel,
  createCategoryModel
} from "./models";
// dotenv : config
config();

const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST } = process.env;
const sequelize = createSequelize(
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_HOST
);

const article = sequelize.import("article", createArticleModel);
const category = sequelize.import("category", createCategoryModel);
const article_has_category = sequelize.import(
  "article_has_category",
  createArticleHasCategoryModel
);
const user = sequelize.import("user", createUserModel);
const comment = sequelize.import("comment", createCommentModel);

//relationship
article.hasMany(article_has_category);
article_has_category.belongsTo(article);
category.hasMany(article_has_category);
article_has_category.belongsTo(category);
user.hasMany(article);
article.hasMany(comment);
user.hasMany(comment);

/* user.sync();
category.sync();
article.sync();
article_has_category.sync();
comment.sync(); */

/* comment.drop();
article_has_category.drop();
article.drop();
category.drop();
user.drop(); */

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public/"));
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session());

const hbs = exphbs.create({
  layoutsDir: `src/views/layouts`,
  defaultLayout: "main",
  extname: "hbs"
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "src/views");

app.get("/", (req, res) => {
  res.render("signin");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post("/signin", createAccount(user));

// server : 3000
app.listen(3000);

import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import { config } from "dotenv";
import createSequelize from "./database/db";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-local";
import {
  createArticleModel,
  createArticleHasCategoryModel,
  createCommentModel,
  createUserModel,
  createCategoryModel
} from "./models";
import { createStrategy } from "./passport/strategy";
import {
  createAuthRouter,
  homeRouter,
  createUserRouter,
  createCommentRouter
} from "./routes";
import { createCategory } from "./database/bulk/createCategory";
import createArticleRouter from "./routes/article/createArticleRouter";
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
// BULK
// -------------
// createCategory(category);
// -------------
// CREATE TABLES
// -------------
// article.sync();
// category.sync();
// article_has_category.sync();
// user.sync();
// comment.sync();
// -------------
// DROP TABLES
// -------------
// article.drop();
// category.drop();
// article_has_category.drop();
// user.drop();
// comment.drop();
// -------------
// Server
const app = express();
app.use(session({ secret: "cats", resave: true, saveUninitialized: true })); // session secret
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(homeRouter);
app.use(createAuthRouter(passport, user));
app.use(createUserRouter(user));
app.use(
  createArticleRouter(article, category, article_has_category, user, comment)
);
app.use(createCommentRouter(comment, article, user));
passport.use("local", createStrategy(Strategy, user));

const hbs = exphbs.create({
  layoutsDir: `src/views/layouts`,
  defaultLayout: "main",
  extname: "hbs",
  helpers: {
    ifCond: function(v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    setVar: function(varName, varValue, options) {
      if (!options.data.root) {
        options.data.root = {};
      }
      options.data.root[varName] = varValue;
    }
  }
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "src/views");

// server : 3000
app.listen(3000);

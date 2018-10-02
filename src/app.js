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
import { authRouter, homeRouter } from "./routes";
import createUserRouter from "./routes/user/createUserRouter";
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

const app = express();
app.use(session({ secret: "cats", resave: true, saveUninitialized: true })); // session secret
app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(authRouter);
app.use(homeRouter);
app.use(createUserRouter(user));
passport.use("local", createStrategy(Strategy, user));

const hbs = exphbs.create({
  layoutsDir: `src/views/layouts`,
  defaultLayout: "main",
  extname: "hbs"
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const authorizedUser = await user.findById(id);
    done(null, authorizedUser);
  } catch (err) {
    done(err);
  }
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "src/views");

// server : 3000
app.listen(3000);

import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import { config } from "dotenv";
import createSequelize from "./database/db";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-local";
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

const app = express();
app.use(session({ secret: "cats", resave: true, saveUninitialized: true })); // session secret
app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

const hbs = exphbs.create({
  layoutsDir: `src/views/layouts`,
  defaultLayout: "main",
  extname: "hbs"
});
passport.use(
  "local",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async function(email, password, done) {
      try {
        const authorizedUser = await user.findOne({ where: { email } });
        if (!authorizedUser) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (authorizedUser.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, authorizedUser);
      } catch (err) {
        console.log(err);
        return done(err, false, { message: "Incorrect username." });
      }
    }
  )
);

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

app.get("/", (req, res) => {
  res.render("index", {
    user: req.user
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

app.get("/signin", (req, res) => {
  res.render("signin");
});
app.post("/signin", createAccount(user));

// server : 3000
app.listen(3000);
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

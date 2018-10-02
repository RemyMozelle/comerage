import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

authRouter.get("/signin", (req, res) => {
  res.render("signin");
});

export default authRouter;

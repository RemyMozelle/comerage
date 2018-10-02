import { Router } from "express";
import AuthController from "../../controllers/auth/AuthController";

const createAuthRouter = (passport, user) => {
  const authRouter = Router();
  //routes
  authRouter.get("/login", AuthController.login());
  authRouter.get("/logout", AuthController.logout());
  authRouter.get("/signin", AuthController.signin());

  authRouter.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
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

  return authRouter;
};

export default createAuthRouter;

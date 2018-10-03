import { Router } from "express";
import AuthController from "../../controllers/auth/AuthController";

const createAuthRouter = (passport, user) => {
  const authRouter = Router();
  const authController = new AuthController();
  //routes
  authRouter.get("/login", authController.login());
  authRouter.get("/logout", authController.logout());
  authRouter.get("/signin", authController.signin());
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

import { Router } from "express";
import UserController from "../../controllers/user/UserController";

const createUserRouter = user => {
  const userRouter = Router();
  const userController = new UserController(user);
  console.log(UserController);
  //routes
  userRouter.post("/signin", userController.createAccount());

  return userRouter;
};

export default createUserRouter;

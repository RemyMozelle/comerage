import { Router } from "express";
import { createAccount } from "../../controllers/user/createAccount";

const createUserRouter = user => {
  const userRouter = Router();

  userRouter.post("/signin", createAccount(user));

  return userRouter;
};

export default createUserRouter;

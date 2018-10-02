import { Router } from "express";

const homeRouter = Router();

homeRouter.get("/", (req, res) => {
  res.render("index", {
    user: req.user
  });
});

export default homeRouter;

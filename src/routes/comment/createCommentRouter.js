import { Router } from "express";
import CommentController from "../../controllers/comment/CommentController";

const createCommentRouter = (comment, article, user) => {
  const commentRouter = Router();
  const commentController = new CommentController();
  //routes
  commentRouter.post("/comments", commentController.commentArticle(comment));

  return commentRouter;
};

export default createCommentRouter;

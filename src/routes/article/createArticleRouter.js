import { Router } from "express";
import ArticleController from "../../controllers/article/ArticleController";

const createArticleRouter = (
  article,
  category,
  article_has_category,
  user,
  comment
) => {
  const articleRouter = Router();
  const articleController = new ArticleController(
    article,
    category,
    user,
    comment,
    article_has_category
  );
  //routes
  articleRouter.get("/", articleController.showAllArticles);
  articleRouter.get("/articles/:id", articleController.showOneArticle);
  articleRouter.get("/articles", articleController.showArticleWithCategory);
  articleRouter.post("/articles", articleController.createArticleWithCategory);
  // articleRouter.get("/edit/articles/:id", articleController.showOneArticleEdit);
  // articleRouter.post(
  //   "/edit/articles/:id_article",
  //   articleController.editOneArticle
  // );
  // articleRouter.post("/del/articles/:id", articleController.deleteArticle);

  return articleRouter;
};

export default createArticleRouter;

import { Router } from "express";
import ArticleController from "../../controllers/article/ArticleController";

const createArticleRouter = (article, category, article_has_category) => {
  const articleRouter = Router();
  const articleController = new ArticleController();
  //routes
  articleRouter.get(
    "/article",
    articleController.showArticleWithCategory(article, category)
  );
  articleRouter.post(
    "/article",
    articleController.createArticleWithCategory(
      article,
      article_has_category,
      category
    )
  );
  articleRouter.get(
    "/",
    articleController.showAllArticles(article, category, article_has_category)
  );
  return articleRouter;
};

export default createArticleRouter;

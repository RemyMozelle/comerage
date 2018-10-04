import { Router } from "express";
import ArticleController from "../../controllers/article/ArticleController";

const createArticleRouter = (article, category, article_has_category, user) => {
  const articleRouter = Router();
  const articleController = new ArticleController();
  //routes
  articleRouter.get(
    "/articles",
    articleController.showArticleWithCategory(article, category)
  );
  articleRouter.post(
    "/articles",
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
  articleRouter.get(
    "/articles/:id",
    articleController.showOneArticle(article, user)
  );
  articleRouter.get(
    "/edit/articles/:id",
    articleController.showOneArticleEdit(
      article,
      category,
      article_has_category
    )
  );
  articleRouter.post(
    "/edit/articles/:id_article",
    articleController.editOneArticle(article, article_has_category)
  );
  articleRouter.post(
    "/del/articles/:id",
    articleController.deleteArticle(article)
  );

  return articleRouter;
};

export default createArticleRouter;

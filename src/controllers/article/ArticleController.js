class ArticleController {
  showArticleWithCategory(article, category) {
    return async (req, res) => {
      const categories = await category.findAll();
      res.render("article", {
        categories
      });
    };
  }

  createArticleWithCategory(Article, Article_has_category) {
    return async (req, res) => {
      const { id } = req.user;
      const { body, categories, publish } = req.body;
      // to do TRANSACTION SEQUELIZE
      if (publish) {
        const article = await Article.create({
          body,
          publish: 1,
          created_at: new Date(),
          user_id: id
        });

        for (let i = 0; i < categories.length; i++) {
          await Article_has_category.create({
            category_id: categories[i],
            article_id: article.id
          });
        }
        res.redirect("/");
      } else {
        const article = await Article.create({
          body,
          publish: 0,
          created_at: new Date(),
          user_id: id
        });
        for (let i = 0; i < categories.length; i++) {
          await Article_has_category.create({
            category_id: categories[i],
            article_id: article.id
          });
        }
        res.redirect("/");
      }
    };
  }

  showAllArticles(Article, Category, Article_has_category) {
    return async (req, res) => {
      const articles = await Article.findAll({
        include: [
          {
            model: Article_has_category,
            include: [
              {
                model: Category
              }
            ]
          }
        ]
      });
      res.render("home", {
        articles,
        user: req.user
      });
    };
  }
}
export default ArticleController;

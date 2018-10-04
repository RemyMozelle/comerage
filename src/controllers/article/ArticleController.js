class ArticleController {
  showArticleWithCategory(article, category) {
    return async (req, res) => {
      const categories = await category.findAll();
      res.render("articles", {
        categories
      });
    };
  }

  createArticleWithCategory(Article, Article_has_category) {
    return async (req, res) => {
      const { id } = req.user;
      const { body, categories, publish } = req.body;
      console.log(req.body);
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
        attributes: ["id", "body", "user_id"],
        where: {
          publish: 1
        },
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
  // JE SUIS ICI
  showOneArticle(Article, User, Comments) {
    return async (req, res) => {
      const article = await Article.findOne({
        where: {
          id: req.params.id
        }
      });
      const userName = await User.findOne({
        where: {
          id: article.user_id
        }
      });

      const comment = await Comments.findAll({
        where: {
          article_id: article.id
        }
      });
      res.render("article", {
        article,
        nickname: userName.nickname,
        user: req.user,
        comment
      });
    };
  }

  showOneArticleEdit(Article, Category, Article_has_category) {
    return async (req, res) => {
      const article = await Article.findById(req.params.id);
      const categories = await Category.findAll();
      const article_has_categories = await Article_has_category.findAll({
        where: {
          article_id: article.id
        },
        include: [
          {
            model: Category
          }
        ]
      });

      res.render("editArticle", {
        article,
        user: req.user,
        categories,
        article_has_categories
      });
    };
  }

  editOneArticle(Article, Article_has_category) {
    // to do verif user
    return async (req, res) => {
      const { body, categories, publish } = req.body;

      if (!categories) {
        res.redirect(`/edit/articles/${req.params.id_article}`);
      }

      if (typeof req.user.id === undefined) {
        res.redirect(`/login`);
      }
      if (publish) {
        try {
          await Article_has_category.destroy({
            where: {
              article_id: req.params.id_article
            }
          });

          await Article.update(
            {
              body,
              publish: 1,
              user_id: req.user.id
            },
            {
              where: {
                id: req.params.id_article
              }
            }
          );
          // to do TRANSACTION SEQUELIZE
          for (let i = 0; i < categories.length; i++) {
            await Article_has_category.create({
              category_id: categories[i],
              article_id: req.params.id_article
            });
          }

          res.redirect("/");
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          await Article.update(
            {
              body,
              publish: 0,
              user_id: id
            },
            {
              where: {
                id: req.params.id_article
              }
            }
          );
          // to do TRANSACTION SEQUELIZE
          for (let i = 0; i < categories.length; i++) {
            await Article_has_category.create({
              category_id: categories[i],
              article_id: req.params.id_article
            });
          }
          res.redirect("/");
        } catch (err) {
          console.error(err);
        }
      }
    };
  }

  deleteArticle(Article) {
    return async (req, res) => {
      const { id } = req.params;

      if (req.user) {
        try {
          await Article.destroy({
            where: {
              id
            }
          });
          res.redirect("/");
        } catch (err) {
          console.error(err);
        }
      }
    };
  }
}
export default ArticleController;

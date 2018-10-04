class ArticleController {
  constructor(article, category, user, comment, article_has_categories) {
    this.article = article;
    this.category = category;
    this.user = user;
    this.comment = comment;
    this.article_has_categories = article_has_categories;
    // bind
    this.showAllArticles = this.showAllArticles.bind(this);
    this.showOneArticle = this.showOneArticle.bind(this);
    this.showArticleWithCategory = this.showArticleWithCategory.bind(this);
    this.createArticleWithCategory = this.createArticleWithCategory.bind(this);
    this.showArticleEdit = this.showArticleEdit.bind(this);
    this.editArticle = this.editArticle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
  }

  // afficher le formulaire d'une création d'article
  async showArticleWithCategory(req, res) {
    const categories = await this.category.findAll();
    res.render("articles", {
      categories
    });
  }
  // créer un article avec les catégories
  async createArticleWithCategory(req, res) {
    const { id } = req.user;
    const { body, categories, publish } = req.body;
    console.log(req.body);
    // to do TRANSACTION SEQUELIZE
    if (publish) {
      const article = await this.article.create({
        body,
        publish: 1,
        created_at: new Date(),
        user_id: id
      });

      for (let i = 0; i < categories.length; i++) {
        await this.article_has_categories.create({
          category_id: categories[i],
          article_id: article.id
        });
      }
      res.redirect("/");
    } else {
      const article = await this.article.create({
        body,
        publish: 0,
        created_at: new Date(),
        user_id: id
      });
      for (let i = 0; i < categories.length; i++) {
        await this.article_has_categories.create({
          category_id: categories[i],
          article_id: article.id
        });
      }
      res.redirect("/");
    }
  }
  // afficher tous les articles avec leurs catégories
  // filtre aussi tous les articles par catégories !
  async showAllArticles(req, res) {
    if (Object.keys(req.query).length === 0) {
      const articles = await this.article.findAll({
        attributes: ["id", "body", "user_id"],
        where: {
          publish: 1
        },
        include: [
          {
            model: this.article_has_categories,
            include: [
              {
                model: this.category
              }
            ]
          }
        ]
      });

      const categories = await this.category.findAll();
      res.render("home", {
        articles,
        user: req.user,
        categories
      });
    } else {
      const articles = await this.article.findAll({
        attributes: ["id", "body", "user_id"],
        where: {
          publish: 1
        },
        include: [
          {
            model: this.article_has_categories,
            where: {
              category_id: req.query.category
            },
            include: [
              {
                model: this.category
              }
            ]
          }
        ]
      });

      const categories = await this.category.findAll();
      res.render("home", {
        articles,
        user: req.user,
        categories
      });
    }
  }
  // afficher uniquement un article qui a été selectionner avec les commentaires
  async showOneArticle(req, res) {
    const article = await this.article.findOne({
      where: {
        id: req.params.id
      }
    });
    const userName = await this.user.findOne({
      where: {
        id: article.user_id
      }
    });
    const comment = await this.comment.findAll({
      where: {
        article_id: article.id
      }
    });

    const userComment = await this.user.findAll({
      attributes: ["id", "nickname"],
      include: [
        {
          model: this.comment,
          attributes: ["id", "body"],
          where: {
            article_id: req.params.id
          }
        }
      ]
    });

    // res.send(userComment);
    res.render("article", {
      article,
      nickname: userName.nickname,
      user: req.user,
      comment,
      userComment
    });
  }
  // afficher l'article qui voudra être modifier
  async showArticleEdit(req, res) {
    const article = await this.article.findById(req.params.id);
    const categories = await this.category.findAll();
    const article_has_categories = await this.article_has_categories.findAll({
      where: {
        article_id: article.id
      },
      include: [
        {
          model: this.category
        }
      ]
    });

    res.render("editArticle", {
      article,
      user: req.user,
      categories,
      article_has_categories
    });
  }
  // modifie l'article
  async editArticle(req, res) {
    const { body, categories, publish } = req.body;

    if (!categories) {
      res.redirect(`/edit/articles/${req.params.id_article}`);
    }

    if (typeof req.user.id === undefined) {
      res.redirect(`/login`);
    }

    if (publish) {
      try {
        await this.article_has_categories.destroy({
          where: {
            article_id: req.params.id_article
          }
        });

        await this.article.update(
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
          await this.article_has_categories.create({
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
        await this.article.update(
          {
            body,
            publish: 0,
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
          await this.article_has_categories.create({
            category_id: categories[i],
            article_id: req.params.id_article
          });
        }
        res.redirect("/");
      } catch (err) {
        console.error(err);
      }
    }
  }
  // supprime définitivement un article
  async deleteArticle(req, res) {
    const { id } = req.params;

    if (req.user) {
      try {
        await this.article.destroy({
          where: {
            id
          }
        });
        res.redirect("/");
      } catch (err) {
        console.error(err);
      }
    }
  }
}
export default ArticleController;

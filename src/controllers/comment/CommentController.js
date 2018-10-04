class CommentController {
  constructor(comment) {
    this.comment = comment;
    //bind
    this.commentArticle = this.commentArticle.bind(this);
  }
  // créer un commentaire pour un article en particulier
  async commentArticle(req, res) {
    const { user_id, article_id, body } = req.body;
    await this.comment.create({
      user_id,
      article_id,
      body,
      created_at: new Date()
    });
    res.redirect(`/articles/${article_id}`);
  }
}
export default CommentController;

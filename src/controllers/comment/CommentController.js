class CommentController {
  commentArticle(comment) {
    return async (req, res) => {
      const { user_id, article_id, body } = req.body;
      console.log(req.body);
      await comment.create({
        user_id,
        article_id,
        body,
        created_at: new Date()
      });
      res.redirect(`/articles/${article_id}`);
    };
  }
}
export default CommentController;

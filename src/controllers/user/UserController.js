class UserController {
  constructor(user) {
    this.user = user;
    this.createAccount = this.createAccount.bind(this);
  }

  async createAccount(req, res) {
    try {
      await this.user.create(req.body);
      res.redirect("/login");
    } catch (err) {
      let messages = err.errors.map(errs => errs);
      res.render("signin", {
        err: messages
      });
    }
  }
}

export default UserController;

class AuthController {
  login() {
    return (req, res) => {
      res.render("login");
    };
  }

  logout() {
    return (req, res) => {
      req.logout();
      res.redirect("/");
    };
  }

  signin() {
    return (req, res) => {
      res.render("signin");
    };
  }
}

export default AuthController;

export const createAccount = user => async (req, res) => {
  try {
    await user.create(req.body);
    res.redirect("/login");
  } catch (err) {
    let messages = err.errors.map(errs => errs);
    res.render("signin", {
      err: messages
    });
  }
};

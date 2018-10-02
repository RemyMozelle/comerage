export const createStrategy = (Strategy, User) => {
  return new Strategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async function(email, password, done) {
      try {
        const authorizedUser = await User.findOne({ where: { email } });
        if (!authorizedUser) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (authorizedUser.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, authorizedUser);
      } catch (err) {
        return done(err, false, { message: "Incorrect username." });
      }
    }
  );
};

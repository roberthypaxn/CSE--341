const isAuthenticated = function (req, res, next) {
  if (req.session.user === undefined) {
    return res
      .status(401)
      .json("You don't have access... You don't always get what you want.");
  }
  next();
};
module.exports = {
  isAuthenticated,
};

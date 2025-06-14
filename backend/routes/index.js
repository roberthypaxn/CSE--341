const xpress = require("express");
const router = xpress.Router();
const passport = require("passport");

router.use("/", require("./swagger"));
router.use("/movies", require("./movies"));
router.use("/reviews", require("./reviews"));
router.use("/users", require("./users"));
router.use("/login", passport.authenticate("github"), function (req, res) {});
router.use("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/", function (req, res) {
  //#swagger.tags=["Hello world"]
  res.send("Hello World");
});

module.exports = router;

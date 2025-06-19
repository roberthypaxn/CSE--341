const xpress = require("express");
const router = xpress.Router();
const passport = require("passport");

router.use("/", require("./swagger"));
router.use("/cars", require("./car"));
router.use("/payments", require("./payment"));
router.use("/reservations", require("./reservation"));
router.use("/users", require("./user"));
router.use("/login", passport.authenticate("github"));
router.use("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;

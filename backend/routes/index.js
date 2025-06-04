const xpress = require("express");
const router = xpress.Router();

router.use("/", require("./swagger"));
router.use("/movies", require("./movies"));
router.use("/reviews", require("./reviews"));
router.use("/users", require("./users"));

router.get("/", function (req, res) {
  //#swagger.tags=["Hello world"]
  res.send("Hello World");
});

module.exports = router;

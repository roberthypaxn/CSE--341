const xpress = require("express");
const router = xpress.Router();

router.use("/", require("./swagger"));
router.use("/cars", require("./car"));

router.get("/", function (req, res) {
  //#swagger.tags=["Hello world"]
  res.send("Hello World");
});

module.exports = router;

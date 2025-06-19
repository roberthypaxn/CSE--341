const xpress = require("express");
const router = xpress.Router();

router.use("/", require("./swagger"));
router.use("/cars", require("./car"));
router.use("/payments", require("./payment"));
router.use("/reservations", require("./reservation"));
router.use("/users", require("./user"));

router.get("/", function (req, res) {
  //#swagger.tags=["Hello world"]
  res.send("Hello World");
});

module.exports = router;

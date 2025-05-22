const xpress = require("express");
const router = xpress.Router();

const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("../swagger.json");

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDoc));

module.exports = router;

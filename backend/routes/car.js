const xpress = require("express");
const router = xpress.Router();
const { isAuthenticated } = require("../middleware/auth");

const carController = require("../controllers/car");

router.get("/", carController.getAllCars);

router.get("/:id", carController.getSingle);

router.post("/", isAuthenticated, carController.createCar);

router.put("/:id", isAuthenticated, carController.updateCar);

router.delete("/:id", isAuthenticated, carController.deleteCar);

module.exports = router;

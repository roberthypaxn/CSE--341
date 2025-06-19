const xpress = require("express");
const router = xpress.Router();

const carController = require("../controllers/car");

router.get("/", carController.getAllCars);

router.get("/:id", carController.getSingle);

router.post("/", carController.createCar);

router.put("/:id", carController.updateCar);

router.delete("/:id", carController.deleteCar);

module.exports = router;

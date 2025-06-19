const xpress = require("express");
const router = xpress.Router();

const reservationController = require("../controllers/reservation");

router.get("/", reservationController.getAllReservations);

router.get("/:id", reservationController.getSingle);

router.post("/", reservationController.createReservation);

router.put("/:id", reservationController.updateReservation);

router.delete("/:id", reservationController.deleteReservation);

module.exports = router;

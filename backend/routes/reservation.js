const xpress = require("express");
const router = xpress.Router();
const { isAuthenticated } = require("../middleware/auth");

const reservationController = require("../controllers/reservation");

router.get("/", reservationController.getAllReservations);

router.get("/:id", reservationController.getSingle);

router.post("/", isAuthenticated, reservationController.createReservation);

router.put("/:id", isAuthenticated, reservationController.updateReservation);

router.delete("/:id", isAuthenticated, reservationController.deleteReservation);

module.exports = router;

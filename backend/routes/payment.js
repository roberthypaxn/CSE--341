const xpress = require("express");
const router = xpress.Router();
const { isAuthenticated } = require("../middleware/auth");

const paymentController = require("../controllers/payment");

router.get("/", paymentController.getAllPayments);

router.get("/:id", paymentController.getSingle);

router.post("/", isAuthenticated, paymentController.createPayment);

router.put("/:id", isAuthenticated, paymentController.updatePayment);

router.delete("/:id", isAuthenticated, paymentController.deletePayment);

module.exports = router;

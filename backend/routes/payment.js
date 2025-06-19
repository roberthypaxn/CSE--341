const xpress = require("express");
const router = xpress.Router();

const paymentController = require("../controllers/payment");

router.get("/", paymentController.getAllPayments);

router.get("/:id", paymentController.getSingle);

router.post("/", paymentController.createPayment);

router.put("/:id", paymentController.updatePayment);

router.delete("/:id", paymentController.deletePayment);

module.exports = router;

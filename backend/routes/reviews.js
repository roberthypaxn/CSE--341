const xpress = require("express");
const router = xpress.Router();

const contactsController = require("../controllers/reviews");

router.get("/", contactsController.getAllReviews);

router.get("/:id", contactsController.getSingleReview);

router.post("/", contactsController.createReview);

router.put("/:id", contactsController.updateReview);

router.delete("/:id", contactsController.deleteReview);

module.exports = router;

const xpress = require("express");
const router = xpress.Router();

const reviewsController = require("../controllers/reviews");

router.get("/", reviewsController.getAllReviews);

router.get("/:id", reviewsController.getSingleReview);

router.post("/", reviewsController.createReview);

router.put("/:id", reviewsController.updateReview);

router.delete("/:id", reviewsController.deleteReview);

module.exports = router;

const xpress = require("express");
const router = xpress.Router();
const { isAuthenticated } = require("../middleware/auth");

const reviewsController = require("../controllers/reviews");

router.get("/", reviewsController.getAllReviews);

router.get("/:id", reviewsController.getSingleReview);

router.post("/", isAuthenticated, reviewsController.createReview);

router.put("/:id", isAuthenticated, reviewsController.updateReview);

router.delete("/:id", isAuthenticated, reviewsController.deleteReview);

module.exports = router;

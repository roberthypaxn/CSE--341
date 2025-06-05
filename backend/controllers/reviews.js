const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllReviews = async (req, res) => {
  //#swagger.tags=["Reviews"]
  const result = await mongodb.getDb().collection("reviews").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingleReview = async (req, res) => {
  //#swagger.tags=["Reviews"]
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    console.log("getSingle() ran!");
    return res.status(400).json({ message: "Invalid Review ID." });
  }
  const reviewId = new ObjectId(id);
  const result = await mongodb
    .getDb()
    .collection("reviews")
    .findOne({ _id: reviewId });
  if (result) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "Review not found." });
  }
};

const createReview = async (req, res) => {
  //#swagger.tags=["Reviews"]

  // Manual validation
  if (
    !req.body.movie_id ||
    !ObjectId.isValid(req.body.movie_id) ||
    !req.body.user_id ||
    !ObjectId.isValid(req.body.user_id) ||
    typeof req.body.stars !== "number" ||
    req.body.stars < 1 ||
    req.body.stars > 5 ||
    typeof req.body.review !== "string" ||
    req.body.review.trim() === ""
  ) {
    return res.status(400).json({ error: "Invalid input for review" });
  }

  const review = {
    movie_id: req.body.movie_id,
    user_id: req.body.user_id,
    stars: req.body.stars, // Expect a number (e.g. 1–5)
    review: req.body.review,
    timestamp: req.body.timestamp, // Optional; could default to new Date()
  };
  const response = await mongodb
    .getDb()
    .collection("reviews")
    .insertOne(review);
  if (response.acknowledged > 0) {
    res.status(201).json(review);
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while creating the review");
  }
};
const updateReview = async (req, res) => {
  //#swagger.tags=["Reviews"]
  const reviewId = new ObjectId(req.params.id);

  // Manual validation
  if (
    !req.body.movie_id ||
    !ObjectId.isValid(req.body.movie_id) ||
    !req.body.user_id ||
    !ObjectId.isValid(req.body.user_id) ||
    typeof req.body.stars !== "number" ||
    req.body.stars < 1 ||
    req.body.stars > 5 ||
    typeof req.body.review !== "string" ||
    req.body.review.trim() === ""
  ) {
    return res.status(400).json({ error: "Invalid input for review" });
  }

  const review = {
    movie_id: req.body.movie_id,
    user_id: req.body.user_id,
    stars: req.body.stars, // Expect a number (e.g. 1–5)
    review: req.body.review,
    timestamp: req.body.timestamp, // Optional; could default to new Date()
  };
  const response = await mongodb
    .getDb()
    .collection("reviews")
    .replaceOne({ _id: reviewId }, review);
  if (response.modifiedCount > 0) {
    res.status(200).json(review);
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while updating the review");
  }
};

const deleteReview = async (req, res) => {
  //#swagger.tags=["Reviews"]
  const reviewId = new ObjectId(req.params.id);

  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const response = await mongodb
    .getDb()
    .collection("reviews")
    .deleteOne({ _id: reviewId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while deleting the review");
  }
};
module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
};

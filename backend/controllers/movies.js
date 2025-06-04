const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllMovies = async (req, res) => {
  //#swagger.tags=["Movies"]
  const result = await mongodb.getDb().collection("movies").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingleMovie = async (req, res) => {
  //#swagger.tags=["Movies"]
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    console.log("getSingle() ran!");
    return res.status(400).json({ message: "Invalid Movie ID." });
  }
  const movieId = new ObjectId(id);
  const result = await mongodb
    .getDb()
    .collection("movies")
    .findOne({ _id: movieId });
  if (result) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "Movie not found." });
  }
};

const createMovie = async (req, res) => {
  //#swagger.tags=["Movies"]
  const movie = {
    title: req.body.title,
    director: req.body.director,
    release_year: req.body.release_year,
    genre: req.body.genre, // Expect an array
    tags: req.body.tags, // Expect an array
    description: req.body.description,
  };
  const response = await mongodb.getDb().collection("movies").insertOne(movie);
  if (response.acknowledged > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while creating the movie");
  }
};
const updateMovie = async (req, res) => {
  //#swagger.tags=["Movies"]
  const movieId = new ObjectId(req.params.id);
  const movie = {
    title: req.body.title,
    director: req.body.director,
    release_year: req.body.release_year,
    genre: req.body.genre, // Expect an array
    tags: req.body.tags, // Expect an array
    description: req.body.description,
  };
  const response = await mongodb
    .getDb()
    .collection("movies")
    .replaceOne({ _id: movieId }, movie);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while updating the movie");
  }
};

const deleteMovie = async (req, res) => {
  //#swagger.tags=["Movies"]
  const movieId = new ObjectId(req.params.id);

  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const response = await mongodb
    .getDb()
    .collection("movies")
    .deleteOne({ _id: movieId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while deleting the movie");
  }
};
module.exports = {
  getAllMovies,
  getSingleMovie,
  createMovie,
  updateMovie,
  deleteMovie,
};

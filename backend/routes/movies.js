const xpress = require("express");
const router = xpress.Router();

const moviesController = require("../controllers/movies");

router.get("/", moviesController.getAllMovies);

router.get("/:id", moviesController.getSingleMovie);

router.post("/", moviesController.createMovie);

router.put("/:id", moviesController.updateMovie);

router.delete("/:id", moviesController.deleteMovie);

module.exports = router;

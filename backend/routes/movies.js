const xpress = require("express");
const router = xpress.Router();
const { isAuthenticated } = require("../middleware/auth");

const moviesController = require("../controllers/movies");

router.get("/", moviesController.getAllMovies);

router.get("/:id", moviesController.getSingleMovie);

router.post("/", isAuthenticated, moviesController.createMovie);

router.put("/:id", isAuthenticated, moviesController.updateMovie);

router.delete("/:id", isAuthenticated, moviesController.deleteMovie);

module.exports = router;

const xpress = require("express");
const router = xpress.Router();

const contactsController = require("../controllers/movies");

router.get("/", contactsController.getAllMovies);

router.get("/:id", contactsController.getSingleMovie);

router.post("/", contactsController.createMovie);

router.put("/:id", contactsController.updateMovie);

router.delete("/:id", contactsController.deleteMovie);

module.exports = router;

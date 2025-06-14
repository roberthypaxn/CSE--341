const xpress = require("express");
const router = xpress.Router();
const { isAuthenticated } = require("../middleware/auth");

const usersController = require("../controllers/users");

router.get("/", usersController.getAllUsers);

router.get("/:id", usersController.getSingleUser);

router.post("/", isAuthenticated, usersController.createUser);

router.put("/:id", isAuthenticated, usersController.updateUser);

router.delete("/:id", isAuthenticated, usersController.deleteUser);

module.exports = router;

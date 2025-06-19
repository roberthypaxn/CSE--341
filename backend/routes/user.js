const xpress = require("express");
const router = xpress.Router();
const { isAuthenticated } = require("../middleware/auth");

const userController = require("../controllers/user");

router.get("/", userController.getAllUsers);

router.get("/:id", userController.getSingle);

router.post("/", isAuthenticated, userController.createUser);

router.put("/:id", isAuthenticated, userController.updateUser);

router.delete("/:id", isAuthenticated, userController.deleteUser);

module.exports = router;

const xpress = require("express");
const router = xpress.Router();

const userController = require("../controllers/user");

router.get("/", userController.getAllUsers);

router.get("/:id", userController.getSingle);

router.post("/", userController.createUser);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;

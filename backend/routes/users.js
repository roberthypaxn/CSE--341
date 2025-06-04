const xpress = require("express");
const router = xpress.Router();

const contactsController = require("../controllers/users");

router.get("/", contactsController.getAllUsers);

router.get("/:id", contactsController.getSingleUser);

router.post("/", contactsController.createUser);

router.put("/:id", contactsController.updateUser);

router.delete("/:id", contactsController.deleteUser);

module.exports = router;

const xpress = require("express");
const router = xpress.Router();

const contactsController = require("../controllers/contacts");

router.get("/", contactsController.getAll);

router.get("/:id", contactsController.getSingle);

//Router.post("/:id", contactsController.poster);

module.exports = router;
//This is a comment

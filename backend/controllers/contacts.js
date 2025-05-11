const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  const result = await mongodb
    .getDb()
    .db("Web_Services")
    .collection("contacts")
    .find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    console.log("Kaput!");
    return res.status(400).json({ message: "Invalid contact ID." });
  }
  const userId = new ObjectId(id);
  const result = await mongodb
    .getDb()
    .db("Web_Services")
    .collection("contacts")
    .findOne({ _id: userId });
  if (result) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "Contact not found." });
  }
};

module.exports = { getAll, getSingle };

const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllUsers = async (req, res) => {
  //#swagger.tags=["Users"]
  const result = await mongodb.getDb().collection("users").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  //#swagger.tags=["Users"]
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    console.log("getSingle() ran!");
    return res.status(400).json({ message: "Invalid user ID." });
  }
  const userId = new ObjectId(id);
  const result = await mongodb
    .getDb()
    .collection("users")
    .findOne({ _id: userId });
  if (result) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "user not found." });
  }
};

const createUser = async (req, res) => {
  //#swagger.tags=["Users"]
  const user = {
    githubId: req.user.githubId, // String: GitHub ID (same as in reservation)
    name: req.user.name, // String: User's name
    email: req.user.email, // String: User's email address
    phoneNumber: req.user.phoneNumber, // String: Optional phone number
    reservations: req.user.reservations, // Array: List of reservations by this user
    createdAt: req.user.createdAt || new Date(), // Date: Account creation time
  };

  const response = await mongodb.getDb().collection("users").insertOne(user);
  if (response.acknowledged > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while creating the user");
  }
};
const updateUser = async (req, res) => {
  //#swagger.tags=["Users"]
  const userId = new ObjectId(req.params.id);
  const user = {
    githubId: req.user.githubId, // String: GitHub ID (same as in reservation)
    name: req.user.name, // String: User's name
    email: req.user.email, // String: User's email address
    phoneNumber: req.user.phoneNumber, // String: Optional phone number
    reservations: req.user.reservations, // Array: List of reservations by this user
    createdAt: req.user.createdAt || new Date(), // Date: Account creation time
  };

  const response = await mongodb
    .getDb()
    .collection("users")
    .replaceOne({ _id: userId }, user);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while updating the user");
  }
};

const deleteUser = async (req, res) => {
  //#swagger.tags=["Users"]
  const userId = new ObjectId(req.params.id);

  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const response = await mongodb
    .getDb()
    .collection("users")
    .deleteOne({ _id: userId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while deleting the user");
  }
};
module.exports = { getAllUsers, getSingle, createUser, updateUser, deleteUser };

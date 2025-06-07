const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllUsers = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const result = await mongodb.getDb().collection("users").find();
    const lists = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingleUser = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      console.log("getSingle() ran!");
      return res.status(400).json({ message: "Invalid User ID." });
    }
    const UserId = new ObjectId(id);
    const result = await mongodb
      .getDb()
      .collection("users")
      .findOne({ _id: UserId });
    if (result) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  //#swagger.tags=["Users"]

  try {
    // Manual validation
    if (
      !req.body.username ||
      !req.body.email ||
      !req.body.passwordHash ||
      !req.body.displayName ||
      !Array.isArray(req.body.favoriteGenres) ||
      typeof req.body.isCritic !== "boolean"
    ) {
      return res.status(400).json({
        error: "Invalid input. Required fields are missing or incorrect.",
      });
    }

    const user = {
      username: req.body.username,
      email: req.body.email,
      passwordHash: req.body.passwordHash, // Stored securely, never raw
      displayName: req.body.displayName,
      bio: req.body.bio,
      favoriteGenres: req.body.favoriteGenres, // Expect an array (e.g. ["sci-fi", "comedy"])
      avatarImageUrl: req.body.avatarImageUrl,
      location: req.body.location,
      joinedDate: req.body.joinedDate, // ISO string or Date object
      isCritic: req.body.isCritic, // Boolean: true if verified critic
    };

    const response = await mongodb.getDb().collection("users").insertOne(user);
    if (response.acknowledged > 0) {
      res.status(201).json(user);
    } else {
      res
        .status(500)
        .json(response.error || "An error occurred while creating the User");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  //#swagger.tags=["Users"]
  const UserId = new ObjectId(req.params.id);
  try {
    // Validate input BEFORE using req.body
    if (
      !req.body.username ||
      !req.body.email ||
      !req.body.passwordHash ||
      !req.body.displayName ||
      !Array.isArray(req.body.favoriteGenres) ||
      typeof req.body.isCritic !== "boolean"
    ) {
      return res.status(400).json({
        error: "Invalid input. Required fields are missing or incorrect.",
      });
    }

    const user = {
      username: req.body.username,
      email: req.body.email,
      passwordHash: req.body.passwordHash, // Stored securely, never raw
      displayName: req.body.displayName,
      bio: req.body.bio,
      favoriteGenres: req.body.favoriteGenres, // Expect an array (e.g. ["sci-fi", "comedy"])
      avatarImageUrl: req.body.avatarImageUrl,
      location: req.body.location,
      joinedDate: req.body.joinedDate, // ISO string or Date object
      isCritic: req.body.isCritic, // Boolean: true if verified critic
    };
    const response = await mongodb
      .getDb()
      .collection("users")
      .replaceOne({ _id: UserId }, user);
    if (response.modifiedCount > 0) {
      res.status(200).json(user);
    } else {
      res
        .status(500)
        .json(response.error || "An error occurred while updating the User");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const UserId = new ObjectId(id);

    const response = await mongodb
      .getDb()
      .collection("users")
      .deleteOne({ _id: UserId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || "An error occurred while deleting the User");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};

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
    console.error("Error in getAllUsers:", err);
    res.status(500).json({ error: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=["Users"]

  try {
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
      res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const user = {
      githubId: req.user.githubId, // String: GitHub ID (same as in reservation)
      name: req.user.name, // String: User's name
      email: req.user.email, // String: User's email address
      phoneNumber: req.user.phoneNumber, // String: Optional phone number
      reservations: req.user.reservations, // Array: List of reservations by this user
      createdAt: req.user.createdAt || new Date(), // Date: Account creation time
    };

    const response = await mongodb.getDb().collection("users").insertOne(user);

    if (response.acknowledged) {
      res
        .status(201)
        .json({ message: "User created", id: response.insertedId });
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(400).json(
        response.error || {
          message: "An error occurred while creating the user",
        }
      );
    }
  } catch (err) {
    console.error("Error in createUser:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const userId = new ObjectId(id);

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
      res.status(200).send(); // OK, updated
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(400).json(
        response.error || {
          message: "An error occurred while updating the user",
        }
      );
    }
  } catch (err) {
    console.error("Error in updateUser:", err);
    res.setHeader("Content-Type", "application/json");
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

    const userId = new ObjectId(id);
    const response = await mongodb
      .getDb()
      .collection("users")
      .deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(204).send(); // No content
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json(
        response.error || {
          message: "User not found or already deleted",
        }
      );
    }
  } catch (err) {
    console.error("Error in deleteUser:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};

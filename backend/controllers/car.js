const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllCars = async (req, res) => {
  //#swagger.tags=["Cars"]
  try {
    const result = await mongodb.getDb().collection("cars").find();
    const lists = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=["Cars"]
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid car ID." });
    }
    const carId = new ObjectId(id);
    const result = await mongodb
      .getDb()
      .collection("cars")
      .findOne({ _id: carId });
    if (result) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Car not found." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCar = async (req, res) => {
  //#swagger.tags=["Cars"]
  try {
    if (
      typeof req.body.make !== "string" ||
      req.body.make.trim() === "" ||
      typeof req.body.model !== "string" ||
      req.body.model.trim() === "" ||
      typeof req.body.year !== "number" ||
      req.body.year < 1900 ||
      req.body.year > new Date().getFullYear() + 1 ||
      typeof req.body.color !== "string" ||
      req.body.color.trim() === "" ||
      typeof req.body.licensePlate !== "string" ||
      req.body.licensePlate.trim() === "" ||
      typeof req.body.mileage !== "number" ||
      req.body.mileage < 0 ||
      typeof req.body.location !== "string" ||
      req.body.location.trim() === ""
    ) {
      return res.status(400).json({ error: "Invalid input for car" });
    }

    const car = {
      make: req.body.make, // String: Car manufacturer
      model: req.body.model, // String: Car model
      year: req.body.year, // Number: Year the car was made
      color: req.body.color, // String: Car color
      licensePlate: req.body.licensePlate, // String: License plate number
      mileage: req.body.mileage, // Number: Current mileage
      location: req.body.location, // String: Where the car is stored
      isAvailable: true, // Boolean: Availability status
    };

    const response = await mongodb.getDb().collection("cars").insertOne(car);

    if (response.acknowledged) {
      res.status(201).json({ message: "Car created", id: response.insertedId });
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(400).json(
        response.error || {
          message: "An error occurred while creating the car",
        }
      );
    }
  } catch (err) {
    console.error("Error in createCar:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: err.message });
  }
};

const updateCar = async (req, res) => {
  //#swagger.tags=["Cars"]
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid car ID." });
    }

    //Manual Validation
    if (
      typeof req.body.make !== "string" ||
      req.body.make.trim() === "" ||
      typeof req.body.model !== "string" ||
      req.body.model.trim() === "" ||
      typeof req.body.year !== "number" ||
      req.body.year < 1900 ||
      req.body.year > new Date().getFullYear() + 1 ||
      typeof req.body.color !== "string" ||
      req.body.color.trim() === "" ||
      typeof req.body.licensePlate !== "string" ||
      req.body.licensePlate.trim() === "" ||
      typeof req.body.mileage !== "number" ||
      req.body.mileage < 0 ||
      typeof req.body.location !== "string" ||
      req.body.location.trim() === ""
    ) {
      return res.status(400).json({ error: "Invalid input for car" });
    }

    const carId = new ObjectId(id);

    const car = {
      make: req.body.make, // String: Car manufacturer
      model: req.body.model, // String: Car model
      year: req.body.year, // Number: Year the car was made
      color: req.body.color, // String: Car color
      licensePlate: req.body.licensePlate, // String: License plate number
      mileage: req.body.mileage, // Number: Current mileage
      location: req.body.location, // String: Where the car is stored
      isAvailable: true, // Boolean: Availability status
    };

    const response = await mongodb
      .getDb()
      .collection("cars")
      .replaceOne({ _id: carId }, car);

    if (response.modifiedCount > 0) {
      res.status(200).send(); // OK, updated
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(400).json(
        response.error || {
          message: "An error occurred while updating the car",
        }
      );
    }
  } catch (err) {
    console.error("Error in updateCar:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: err.message });
  }
};

const deleteCar = async (req, res) => {
  //#swagger.tags=["Cars"]
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const carId = new ObjectId(id);
    const response = await mongodb
      .getDb()
      .collection("cars")
      .deleteOne({ _id: carId });

    if (response.deletedCount > 0) {
      res.status(204).send(); // No content
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json(
        response.error || {
          message: "Car not found or already deleted",
        }
      );
    }
  } catch (err) {
    console.error("Error in deleteCar:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllCars, getSingle, createCar, updateCar, deleteCar };

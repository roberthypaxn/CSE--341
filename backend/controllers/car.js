const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags=["Cars"]
  const result = await mongodb.getDb().collection("cars").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  //#swagger.tags=["Cars"]
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    console.log("getSingle() ran!");
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
};

const createCar = async (req, res) => {
  //#swagger.tags=["Cars"]
  const car = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };
  const response = await mongodb.getDb().collection("cars").insertOne(car);
  if (response.acknowledged > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while creating the car");
  }
};
const updateCar = async (req, res) => {
  //#swagger.tags=["Cars"]
  const carId = new ObjectId(req.params.id);
  const car = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };
  const response = await mongodb
    .getDb()
    .collection("cars")
    .replaceOne({ _id: carId }, car);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while updating the car");
  }
};

const deleteCar = async (req, res) => {
  //#swagger.tags=["Cars"]
  const carId = new ObjectId(req.params.id);

  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const response = await mongodb
    .getDb()
    .collection("cars")
    .deleteOne({ _id: carId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while deleting the car");
  }
};
module.exports = { getAll, getSingle, createCar, updateCar, deleteCar };

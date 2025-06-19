const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllPayments = async (req, res) => {
  //#swagger.tags=["Payments"]
  const result = await mongodb.getDb().collection("payments").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  //#swagger.tags=["Payments"]
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    console.log("getSingle() ran!");
    return res.status(400).json({ message: "Invalid payment ID." });
  }
  const paymentId = new ObjectId(id);
  const result = await mongodb
    .getDb()
    .collection("payments")
    .findOne({ _id: paymentId });
  if (result) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "payment not found." });
  }
};

const createPayment = async (req, res) => {
  //#swagger.tags=["Payments"]
  const payment = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };
  const response = await mongodb
    .getDb()
    .collection("payments")
    .insertOne(payment);
  if (response.acknowledged > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while creating the payment");
  }
};
const updatePayment = async (req, res) => {
  //#swagger.tags=["Payments"]
  const paymentId = new ObjectId(req.params.id);
  const payment = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };
  const response = await mongodb
    .getDb()
    .collection("payments")
    .replaceOne({ _id: paymentId }, payment);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while updating the payment");
  }
};

const deletePayment = async (req, res) => {
  //#swagger.tags=["Payments"]
  const paymentId = new ObjectId(req.params.id);

  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const response = await mongodb
    .getDb()
    .collection("payments")
    .deleteOne({ _id: paymentId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while deleting the payment");
  }
};
module.exports = {
  getAllPayments,
  getSingle,
  createPayment,
  updatePayment,
  deletePayment,
};

const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllReservations = async (req, res) => {
  //#swagger.tags=["Reservations"]
  const result = await mongodb.getDb().collection("reservations").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  //#swagger.tags=["Reservations"]
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    console.log("getSingle() ran!");
    return res.status(400).json({ message: "Invalid reservation ID." });
  }
  const reservationId = new ObjectId(id);
  const result = await mongodb
    .getDb()
    .collection("reservations")
    .findOne({ _id: reservationId });
  if (result) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "reservation not found." });
  }
};

const createReservation = async (req, res) => {
  //#swagger.tags=["Reservations"]
  const reservation = {
    userId: req.user.githubId, // String: GitHub ID from session
    carId: req.body.carId, // String: ID of the rented car
    startDate: req.body.startDate, // Date: Rental start date
    endDate: req.body.endDate, // Date: Rental end date
    totalCost: req.body.totalCost, // Number: Total rental cost
    pickupLocation: req.body.pickupLocation, // String: Where to pick up the car
    insuranceSelected: req.body.insuranceSelected, // Boolean: Whether insurance is added
    status: "pending", // String: Reservation status (default: pending)
    createdAt: new Date(), // Date: Timestamp of reservation creation
  };
  const response = await mongodb
    .getDb()
    .collection("reservations")
    .insertOne(reservation);
  if (response.acknowledged > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || "An error occurred while creating the reservation"
      );
  }
};
const updateReservation = async (req, res) => {
  //#swagger.tags=["Reservations"]
  const reservationId = new ObjectId(req.params.id);
  const reservation = {
    userId: req.user.githubId, // String: GitHub ID from session
    carId: req.body.carId, // String: ID of the rented car
    startDate: req.body.startDate, // Date: Rental start date
    endDate: req.body.endDate, // Date: Rental end date
    totalCost: req.body.totalCost, // Number: Total rental cost
    pickupLocation: req.body.pickupLocation, // String: Where to pick up the car
    insuranceSelected: req.body.insuranceSelected, // Boolean: Whether insurance is added
    status: "pending", // String: Reservation status (default: pending)
    createdAt: new Date(), // Date: Timestamp of reservation creation
  };
  const response = await mongodb
    .getDb()
    .collection("reservations")
    .replaceOne({ _id: reservationId }, reservation);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || "An error occurred while updating the reservation"
      );
  }
};

const deleteReservation = async (req, res) => {
  //#swagger.tags=["Reservations"]
  const reservationId = new ObjectId(req.params.id);

  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const response = await mongodb
    .getDb()
    .collection("reservations")
    .deleteOne({ _id: reservationId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || "An error occurred while deleting the reservation"
      );
  }
};
module.exports = {
  getAllReservations,
  getSingle,
  createReservation,
  updateReservation,
  deleteReservation,
};

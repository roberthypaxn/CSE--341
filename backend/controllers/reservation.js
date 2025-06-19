const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllReservations = async (req, res) => {
  //#swagger.tags=["Reservations"]
  try {
    const result = await mongodb.getDb().collection("reservations").find();
    const lists = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  } catch (err) {
    console.error("Error in getAllReservations:", err);
    res.status(500).json({ error: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=["Reservations"]

  try {
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
      res.status(404).json({ message: "Reservation not found." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createReservation = async (req, res) => {
  //#swagger.tags=["Reservations"]
  try {
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

    if (response.acknowledged) {
      res
        .status(201)
        .json({ message: "Reservation created", id: response.insertedId });
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(400).json(
        response.error || {
          message: "An error occurred while creating the reservation",
        }
      );
    }
  } catch (err) {
    console.error("Error in createReservation:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: err.message });
  }
};

const updateReservation = async (req, res) => {
  //#swagger.tags=["Reservations"]
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid reservation ID." });
    }

    const reservationId = new ObjectId(id);

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
      res.status(200).send(); // OK, updated
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(400).json(
        response.error || {
          message: "An error occurred while updating the reservation",
        }
      );
    }
  } catch (err) {
    console.error("Error in updateReservation:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: err.message });
  }
};

const deleteReservation = async (req, res) => {
  //#swagger.tags=["Reservations"]
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const reservationId = new ObjectId(id);
    const response = await mongodb
      .getDb()
      .collection("reservations")
      .deleteOne({ _id: reservationId });

    if (response.deletedCount > 0) {
      res.status(204).send(); // No content
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json(
        response.error || {
          message: "Reservation not found or already deleted",
        }
      );
    }
  } catch (err) {
    console.error("Error in deleteReservation:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllReservations,
  getSingle,
  createReservation,
  updateReservation,
  deleteReservation,
};

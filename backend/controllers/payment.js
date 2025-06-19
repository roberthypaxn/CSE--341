const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAllPayments = async (req, res) => {
  //#swagger.tags=["Payments"]
  try {
    const result = await mongodb.getDb().collection("payments").find();
    const lists = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  } catch (err) {
    console.error("Error in getAllPayments:", err);
    res.status(500).json({ error: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=["Payments"]

  try {
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
      res.status(404).json({ message: "Payment not found." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPayment = async (req, res) => {
  //#swagger.tags=["Payments"]
  try {
    const payment = {
      userId: req.user.githubId, // String: ID of the paying user
      reservationId: req.body.reservationId, // String: Associated reservation
      amount: req.body.amount, // Number: Total amount paid
      method: req.body.method, // String: Payment method (e.g., 'credit_card', 'paypal')
      status: "pending", // String: Payment status ('pending', 'completed', etc.)
      paidAt: req.body.paidAt || null, // Date: When payment was made (if applicable)
      transactionId: req.body.transactionId, // String: Reference ID from payment gateway
    };

    const response = await mongodb
      .getDb()
      .collection("payments")
      .insertOne(payment);

    if (response.acknowledged) {
      res
        .status(201)
        .json({ message: "Payment created", id: response.insertedId });
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(400).json(
        response.error || {
          message: "An error occurred while creating the payment",
        }
      );
    }
  } catch (err) {
    console.error("Error in createPayment:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: err.message });
  }
};

const updatePayment = async (req, res) => {
  //#swagger.tags=["Payments"]
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid payment ID." });
    }

    const paymentId = new ObjectId(id);

    const payment = {
      userId: req.user.githubId, // String: ID of the paying user
      reservationId: req.body.reservationId, // String: Associated reservation
      amount: req.body.amount, // Number: Total amount paid
      method: req.body.method, // String: Payment method (e.g., 'credit_card', 'paypal')
      status: "pending", // String: Payment status ('pending', 'completed', etc.)
      paidAt: req.body.paidAt || null, // Date: When payment was made (if applicable)
      transactionId: req.body.transactionId, // String: Reference ID from payment gateway
    };

    const response = await mongodb
      .getDb()
      .collection("payments")
      .replaceOne({ _id: paymentId }, payment);

    if (response.modifiedCount > 0) {
      res.status(200).send(); // OK, updated
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(400).json(
        response.error || {
          message: "An error occurred while updating the payment",
        }
      );
    }
  } catch (err) {
    console.error("Error in updatePayment:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: err.message });
  }
};

const deletePayment = async (req, res) => {
  //#swagger.tags=["Payments"]
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const paymentId = new ObjectId(id);
    const response = await mongodb
      .getDb()
      .collection("payments")
      .deleteOne({ _id: paymentId });

    if (response.deletedCount > 0) {
      res.status(204).send(); // No content
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json(
        response.error || {
          message: "Payment not found or already deleted",
        }
      );
    }
  } catch (err) {
    console.error("Error in deletePayment:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllPayments,
  getSingle,
  createPayment,
  updatePayment,
  deletePayment,
};

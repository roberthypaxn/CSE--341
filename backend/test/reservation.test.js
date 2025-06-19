const { getAllReservations, getSingle } = require("../controllers/reservation");
const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

jest.mock("../db/connect");

describe("getAllReservations", () => {
  it("returns all reservations", async () => {
    const data = [{ carId: "123", totalCost: 500 }];
    const toArray = jest.fn().mockResolvedValue(data);

    mongodb.getDb.mockReturnValue({
      collection: () => ({ find: () => ({ toArray }) }),
    });

    const req = {};
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllReservations(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  it("handles errors with 500", async () => {
    const error = new Error("Database error");
    mongodb.getDb.mockReturnValue({
      collection: () => ({
        find: () => ({
          toArray: jest.fn().mockRejectedValue(error),
        }),
      }),
    });

    const req = {};
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllReservations(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});

describe("getSingle reservation", () => {
  it("returns 400 on invalid ID", async () => {
    const req = { params: { id: "bad" } };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid reservation ID.",
    });
  });

  it("returns 200 if found", async () => {
    const reservation = {
      _id: new ObjectId(),
      carId: "123",
      totalCost: 500,
    };
    const req = { params: { id: reservation._id.toHexString() } };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockResolvedValue(reservation),
      }),
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(reservation);
  });

  it("returns 404 if not found", async () => {
    const req = { params: { id: new ObjectId().toHexString() } };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockResolvedValue(null),
      }),
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Reservation not found.",
    });
  });

  it("handles errors with 500", async () => {
    const error = new Error("Database error");
    const req = { params: { id: new ObjectId().toHexString() } };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockRejectedValue(error),
      }),
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});

const { getAllPayments, getSingle } = require("../controllers/payment");
const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

jest.mock("../db/connect");

describe("getAllPayments", () => {
  it("returns all payments", async () => {
    const data = [{ amount: 100 }];
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

    await getAllPayments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(data);
  });
});

describe("getSingle payment", () => {
  it("400 on invalid ID", async () => {
    const req = { params: { id: "bad" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 200 if found", async () => {
    const payment = { _id: new ObjectId(), amount: 200 };
    const req = { params: { id: payment._id.toHexString() } };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockResolvedValue(payment),
      }),
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(payment);
  });

  it("returns 404 if not found", async () => {
    const req = { params: { id: new ObjectId().toHexString() } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockResolvedValue(null),
      }),
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

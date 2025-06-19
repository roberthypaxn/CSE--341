const { getAllCars } = require("../controllers/car");
const mongodb = require("../db/connect");

jest.mock("../db/connect");

describe("getAllCars", () => {
  it("responds with a list of cars", async () => {
    const mockCars = [{ name: "Toyota" }, { name: "Honda" }];
    const mockToArray = jest.fn().mockResolvedValue(mockCars);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    mongodb.getDb.mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: mockFind,
      }),
    });

    const req = {};
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllCars(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCars);
  });

  it("handles errors and sends 500", async () => {
    const error = new Error("DB failure");
    mongodb.getDb.mockImplementation(() => {
      throw error;
    });

    const req = {};
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllCars(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});

const { getSingle } = require("../controllers/car");
const { ObjectId } = require("mongodb");

describe("getSingle", () => {
  it("returns 400 for invalid ObjectId", async () => {
    const req = { params: { id: "invalid-id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid car ID." });
  });

  it("returns 200 with car data when found", async () => {
    const fakeCar = { _id: new ObjectId(), name: "Nissan" };
    const req = { params: { id: fakeCar._id.toHexString() } };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockResolvedValue(fakeCar),
      }),
    });

    await getSingle(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeCar);
  });

  it("returns 404 when car not found", async () => {
    const id = new ObjectId().toHexString();
    const req = { params: { id } };
    const res = {
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
    expect(res.json).toHaveBeenCalledWith({ message: "Car not found." });
  });

  it("handles database errors with 500", async () => {
    const id = new ObjectId().toHexString();
    const req = { params: { id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mongodb.getDb.mockReturnValue({
      collection: () => ({
        findOne: jest.fn().mockRejectedValue(new Error("DB fail")),
      }),
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB fail" });
  });
});

const request = require("supertest");
const { app, server } = require("../app"); // Assumes server export for open handles fix
const ObjectId = require("mongodb").ObjectId;
const mongodb = require("../db/connect");

// Mock the MongoDB module
jest.mock("../db/connect");

describe("Car API", () => {
  let mockDb;
  let mockCollection;

  beforeAll(() => {
    // Mock the database and collection
    mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
      findOne: jest.fn(),
    };
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    mongodb.getDb.mockReturnValue(mockDb);
  });

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
    if (server) server.close(); // Close server to fix open handles
  });

  it("GET /cars → returns all cars", async () => {
    const mockCars = [
      { _id: "1", make: "Toyota", model: "Camry", year: 2020 },
      { _id: "2", make: "Honda", model: "Civic", year: 2019 },
    ];
    mockCollection.toArray.mockResolvedValue(mockCars);

    const res = await request(app).get("/cars");

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(mockCars);
    expect(mockDb.collection).toHaveBeenCalledWith("cars");
    expect(mockCollection.find).toHaveBeenCalled();
    expect(mockCollection.toArray).toHaveBeenCalled();
  });

  it("GET /cars → handles database error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error
    mockCollection.toArray.mockRejectedValue(new Error("Database error"));
    const res = await request(app).get("/cars");
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Database error" });
    jest.spyOn(console, "error").mockRestore();
  });

  describe("GET /cars/:id", () => {
    it("returns a single car for a valid ID", async () => {
      const validId = new ObjectId().toString();
      const mockCar = {
        _id: validId,
        make: "Toyota",
        model: "Camry",
        year: 2020,
      };
      mockCollection.findOne.mockResolvedValue(mockCar);

      const res = await request(app).get(`/cars/${validId}`);

      expect(res.statusCode).toBe(200);
      expect(res.headers["content-type"]).toMatch(/application\/json/);
      expect(res.body).toEqual(mockCar);
      expect(mockDb.collection).toHaveBeenCalledWith("cars");
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        _id: expect.any(ObjectId),
      });
    });

    it("returns 400 for an invalid ID", async () => {
      const invalidId = "abc";
      const res = await request(app).get(`/cars/${invalidId}`);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Invalid car ID." });
      expect(mockCollection.findOne).not.toHaveBeenCalled();
    });

    it("returns 404 when car is not found", async () => {
      const validId = new ObjectId().toString();
      mockCollection.findOne.mockResolvedValue(null);

      const res = await request(app).get(`/cars/${validId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Car not found." });
      expect(mockDb.collection).toHaveBeenCalledWith("cars");
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        _id: expect.any(ObjectId),
      });
    });

    it("returns 500 on database error", async () => {
      const validId = new ObjectId().toString();
      const dbError = new Error("Database error");
      mockCollection.findOne.mockRejectedValue(dbError);

      const res = await request(app).get(`/cars/${validId}`);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: "Database error" });
      expect(mockDb.collection).toHaveBeenCalledWith("cars");
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        _id: expect.any(ObjectId),
      });
    });
  });
});

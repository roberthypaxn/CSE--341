const { getAllUsers, getSingle } = require("../controllers/user");
const mongodb = require("../db/connect");
const { ObjectId } = require("mongodb");

jest.mock("../db/connect");

describe("getAllUsers", () => {
  it("returns all users", async () => {
    const data = [{ name: "Alice" }, { name: "Bob" }];
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

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(data);
  });
});

describe("getSingle user", () => {
  it("400 on invalid ID", async () => {
    const req = { params: { id: "bad" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("200 if found", async () => {
    const user = { _id: new ObjectId(), name: "Alice" };
    const req = { params: { id: user._id.toHexString() } };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mongodb.getDb.mockReturnValue({
      collection: () => ({ findOne: jest.fn().mockResolvedValue(user) }),
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("404 if not found", async () => {
    const req = { params: { id: new ObjectId().toHexString() } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    mongodb.getDb.mockReturnValue({
      collection: () => ({ findOne: jest.fn().mockResolvedValue(null) }),
    });

    await getSingle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

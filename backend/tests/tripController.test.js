// Mock les dépendances AVANT d'importer
jest.mock("../src/models/Trip", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));
jest.mock("../src/models/User", () => ({
  findById: jest.fn(),
}));
jest.mock("../src/models/Vehicle", () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));
jest.mock("../src/utils/maintenanceRules", () => ({
  checkAndUpdateMaintenance: jest.fn(),
}));

const tripController = require("../src/controllers/tripController");
const Trip = require("../src/models/Trip");
const User = require("../src/models/User");
const Vehicle = require("../src/models/Vehicle");

describe("TripController Tests", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {},
      query: {},
      body: {},
      user: { userId: "admin123", role: "admin" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe("getAllTrips - Récupérer tous les trajets", () => {
    test("devrait retourner tous les trajets pour un admin", async () => {
      const mockTrips = [
        { _id: "trip1", status: "completed" },
        { _id: "trip2", status: "in-progress" },
      ];

      Trip.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockTrips),
      });

      await tripController.getAllTrips(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockTrips,
      });
    });
  });

  describe("createTrip - Créer un nouveau trajet", () => {
    test("devrait créer un trajet avec succès", async () => {
      req.body = {
        driver: "driver123",
        truck: "truck123",
        trailer: "trailer123",
        departure: { location: "Paris" },
        arrival: { location: "Lyon" },
      };

      User.findById.mockResolvedValue({ _id: "driver123", role: "chauffeur" });
      Vehicle.findById
        .mockResolvedValueOnce({ _id: "truck123", type: "truck" }) 
        .mockResolvedValueOnce({ _id: "trailer123", type: "trailer" }); 

      Trip.create.mockResolvedValue({ _id: "newTrip", ...req.body });

      const mockTrip = { _id: "newTrip", ...req.body };
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
 
        then: function (resolve) {
          resolve(mockTrip);
        },
      };
      Trip.findById.mockReturnValue(mockQuery);

      await tripController.createTrip(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getTripById - Récupérer un trajet par ID", () => {
    test("devrait retourner un trajet existant", async () => {
      const mockTrip = { _id: "trip123" };
  
      const mockPopulate = { populate: jest.fn().mockResolvedValue(mockTrip) };
      const mockPopulate1 = {
        populate: jest.fn().mockReturnValue(mockPopulate),
      };
      const mockPopulate2 = {
        populate: jest.fn().mockReturnValue(mockPopulate1),
      };
      Trip.findById.mockReturnValue(mockPopulate2);

      await tripController.getTripById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteTrip - Supprimer un trajet", () => {
    test("devrait supprimer un trajet", async () => {
      const mockTrip = { _id: "trip123", deleteOne: jest.fn() };
      Trip.findById.mockResolvedValue(mockTrip);

      await tripController.deleteTrip(req, res, next);

      expect(mockTrip.deleteOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

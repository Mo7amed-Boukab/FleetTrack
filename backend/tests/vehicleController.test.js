// Mock les dépendances AVANT d'importer
jest.mock("../src/models/Vehicle", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));
jest.mock("../src/models/Tire", () => ({}));
jest.mock("../src/utils/maintenanceRules", () => ({
  checkAndUpdateMaintenance: jest.fn(),
}));

const vehicleController = require("../src/controllers/vehicleController");
const Vehicle = require("../src/models/Vehicle");

describe("VehicleController Tests", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { params: {}, query: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe("getAllVehicles - Récupérer tous les véhicules", () => {
    test("devrait retourner tous les véhicules", async () => {
      const mockVehicles = [
        { _id: "1", Immatriculation: "ABC123" },
        { _id: "2", Immatriculation: "XYZ789" },
      ];

      Vehicle.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockVehicles),
      });

      await vehicleController.getAllVehicles(req, res, next);

      expect(Vehicle.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockVehicles,
      });
    });
  });

  describe("createVehicle - Créer un nouveau véhicule", () => {
    test("devrait créer un véhicule avec succès", async () => {
      const newVehicle = {
        Immatriculation: "NEW123",
        type: "truck",
      };

      req.body = newVehicle;
      Vehicle.create.mockResolvedValue({ _id: "newId", ...newVehicle });

      await vehicleController.createVehicle(req, res, next);

      expect(Vehicle.create).toHaveBeenCalledWith(newVehicle);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getVehicleById - Récupérer un véhicule par ID", () => {
    test("devrait retourner un véhicule existant", async () => {
      const mockVehicle = { _id: "vehicle123", Immatriculation: "ABC123" };
      Vehicle.findById.mockResolvedValue(mockVehicle);

      await vehicleController.getVehicleById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVehicle,
      });
    });
  });

  describe("updateVehicle - Modifier un véhicule", () => {
    test("devrait mettre à jour le véhicule", async () => {
      const mockUpdated = { _id: "vehicle123", mileage: 5000 };
      Vehicle.findByIdAndUpdate.mockResolvedValue(mockUpdated);
      Vehicle.findById.mockResolvedValue(mockUpdated);
      req.params.id = "vehicle123";
      req.body = { mileage: 5000 };

      await vehicleController.updateVehicle(req, res, next);

      expect(Vehicle.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteVehicle - Supprimer un vÃ©hicule", () => {
    test("devrait supprimer un vÃ©hicule", async () => {
      const mockVehicle = { _id: "vehicle123", deleteOne: jest.fn() };
      Vehicle.findById.mockResolvedValue(mockVehicle);
      req.params.id = "vehicle123";

      await vehicleController.deleteVehicle(req, res, next);

      expect(mockVehicle.deleteOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

// Mock les dépendances AVANT d'importer
jest.mock("../src/models/Tire", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));
jest.mock("../src/models/Vehicle", () => ({
  findById: jest.fn(),
}));
jest.mock("../src/utils/maintenanceRules", () => ({
  checkAndUpdateMaintenance: jest.fn(),
}));

const tireController = require("../src/controllers/tireController");
const Tire = require("../src/models/Tire");

describe("TireController Tests", () => {
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

  describe("getAllTires - Récupérer tous les pneus", () => {
    test("devrait retourner tous les pneus", async () => {
      const mockTires = [
        { _id: "tire1", serialNumber: "SN12345" },
        { _id: "tire2", serialNumber: "SN67890" },
      ];

      Tire.find.mockReturnValue({
          populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockTires),
        }),
      });

      await tireController.getAllTires(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockTires,
      });
    });
  });

  describe("createTire - Créer un nouveau pneu", () => {
    test("devrait créer un pneu avec succès", async () => {
      const newTire = {
        serialNumber: "SN99999",
        brand: "Continental",
      };

      req.body = newTire;
      Tire.findOne.mockResolvedValue(null);
      Tire.create.mockResolvedValue({ _id: "newTireId", ...newTire });

      await tireController.createTire(req, res, next);

      expect(Tire.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("getTireById - Récupérer un pneu", () => {
    test("devrait retourner un pneu", async () => {
      const mockTire = { _id: "tire123" };
      Tire.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTire),
      });

      await tireController.getTireById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteTire - Supprimer un pneu", () => {
    test("devrait supprimer un pneu", async () => {
      const mockTire = { _id: "tire123", status: "in_stock" };
      Tire.findById.mockResolvedValue(mockTire);
      Tire.findByIdAndDelete.mockResolvedValue(mockTire);

      await tireController.deleteTire(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});

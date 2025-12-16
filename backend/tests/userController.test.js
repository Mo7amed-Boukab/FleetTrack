// Mock les dépendances AVANT d'importer
jest.mock("../src/models/User");

const userController = require("../src/controllers/userController");
const User = require("../src/models/User");

describe("UserController Tests", () => {
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

  describe("getAllUsers - Récupérer tous les chauffeurs", () => {
    test("devrait retourner la liste de tous les chauffeurs", async () => {
      // Créer des faux chauffeurs
      const mockDrivers = [
        {
          _id: "1",
          fullname: "Driver 1",
          email: "driver1@test.com",
          role: "chauffeur",
        },
        {
          _id: "2",
          fullname: "Driver 2",
          email: "driver2@test.com",
          role: "chauffeur",
        },
      ];

      // Simuler la fonction find de MongoDB avec .select()
      User.find = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockDrivers),
      });

      // Appeler la fonction
      await userController.getAllUsers(req, res, next);

      // Vérifier les résultats
      expect(User.find).toHaveBeenCalledWith({ role: "chauffeur" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockDrivers,
      });
    });
  });

  describe("getUserById - Récupérer un utilisateur par ID", () => {
    test("devrait retourner un utilisateur existant", async () => {
      req.params.id = "user123";

      const mockUser = {
        _id: "user123",
        fullname: "John Doe",
        email: "john@test.com",
      };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });

    test("devrait retourner 404 si utilisateur non trouvé", async () => {
      req.params.id = "inexistant";

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });
});

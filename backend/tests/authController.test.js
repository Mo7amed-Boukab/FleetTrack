// Mock les dÃ©pendances AVANT d'importer le controller
jest.mock("../src/models/User");
jest.mock("../src/utils/jwt");

const authController = require("../src/controllers/authController");
const User = require("../src/models/User");
const { generateToken } = require("../src/utils/jwt");

describe("AuthController Tests", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    // Créer des objets mock pour request, response, et next
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe("login - Connexion utilisateur", () => {
    test("devrait connecter un utilisateur avec des credentials valides", async () => {

      const mockUser = {
        _id: "user123",
        email: "admin@test.com",
        role: "admin",
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          _id: "user123",
          email: "admin@test.com",
          role: "admin",
        }),
      };

      req.body = { email: "admin@test.com", password: "Password123!" };

      // Simuler la recherche de l'utilisateur dans la base
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      generateToken.mockReturnValue("fakeAccessToken123");

      // Exécuter la fonction login
      await authController.login(req, res, next);

      // Vérifier que tout s'est bien passé
      expect(User.findOne).toHaveBeenCalledWith({ email: "admin@test.com" });
      expect(mockUser.comparePassword).toHaveBeenCalledWith("Password123!");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Login successful.",
        })
      );
    });

    test("devrait retourner erreur 401 si utilisateur non trouvé", async () => {
      req.body = { email: "inexistant@test.com", password: "Pass123!" };

      // Simuler qu'aucun utilisateur n'existe
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await authController.login(req, res, next);

      // Vérifier que l'erreur est retournée
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
    });
  });
});

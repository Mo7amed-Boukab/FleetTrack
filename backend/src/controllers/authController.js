const User = require("../models/User");
const { generateToken, generateRefreshToken } = require("../utils/jwt");

class AuthController {
  /**
   * Inscription d'un nouvel utilisateur
   */
  register = async (req, res, next) => {
    try {
      const { fullname, email, password, role, telephone } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      // Créer un nouvel utilisateur (le password sera hashé automatiquement par le pre-save hook dans User Model)
      const newUser = new User({ fullname, email, password, role, telephone });
      await newUser.save();

      // Générer les tokens
      const payload = {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      };

      const accessToken = generateToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.status(201).json({
        message: "User registered successfully.",
        user: newUser.toJSON(),
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Connexion d'un utilisateur
   */
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Comparer les mots de passe
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Générer les tokens
      const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
      };
      const accessToken = generateToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.status(200).json({
        message: "Login successful.",
        user: user.toJSON(),
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
module.exports = new AuthController();

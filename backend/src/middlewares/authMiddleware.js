const { verifyToken } = require("../utils/jwt");

/**
 * Middleware d'authentification
 * Vérifie la présence et la validité du token JWT
 */

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.token = token;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Middleware pour vérifier le rôle de l'utilisateur
 * @param {Array} roles - Rôles autorisés
 * @return {Function} Middleware fonction
 */

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };

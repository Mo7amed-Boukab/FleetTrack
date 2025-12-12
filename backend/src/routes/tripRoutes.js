const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.use(authenticate);

// Listes des trajets
router.get("/", tripController.getAllTrips);
router.get("/:id", tripController.getTripById);

// Création par Admin
router.post("/", authorize("admin"), tripController.createTrip);

// Mise à jour Admin ou Chauffeur
router.put("/:id", tripController.updateTrip);

// Suppression par Admin
router.delete("/:id", authorize("admin"), tripController.deleteTrip);

module.exports = router;

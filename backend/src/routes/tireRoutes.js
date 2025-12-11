const express = require("express");
const router = express.Router();
const tireController = require("../controllers/tireController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.use(authenticate);

router.get("/", tireController.getAllTires);
router.get("/:id", tireController.getTireById);

router.post("/", authorize("admin"), tireController.createTire);
router.put("/:id", authorize("admin"), tireController.updateTire);
router.delete("/:id", authorize("admin"), tireController.deleteTire);

router.put("/:id/assign", authorize("admin"), tireController.assignTire);
router.put("/:id/unassign", authorize("admin"), tireController.unassignTire);

module.exports = router;

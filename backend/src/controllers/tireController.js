const Tire = require("../models/Tire");
const Vehicle = require("../models/Vehicle");
const { checkAndUpdateMaintenance } = require('../utils/maintenanceRules');

class TireController {
  /**
   * @desc    Get all tires
   * @route   GET /api/tires
   * @access  Private
   */
  getAllTires = async (req, res, next) => {
    try {
      const { status, condition } = req.query;
      const filter = {};

      if (status) filter.status = status;
      if (condition) filter.condition = condition;

      const tires = await Tire.find(filter).populate("vehicle", "Immatriculation brand model type").sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: tires.length,
        data: tires,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get tire by ID
   * @route   GET /api/tires/:id
   * @access  Private
   */
  getTireById = async (req, res, next) => {
    try {
      const tire = await Tire.findById(req.params.id).populate("vehicle","Immatriculation brand model type");

      if (!tire) {
        return res.status(404).json({ message: "Tire not found" });
      }

      res.status(200).json({
        success: true,
        data: tire,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Create new tire
   * @route   POST /api/tires
   * @access  Private
   */
  createTire = async (req, res, next) => {
    try {
      const { serialNumber, brand, condition, status } = req.body;

      const existingTire = await Tire.findOne({ serialNumber });
      if (existingTire) {
        return res.status(400).json({ message: "Tire with this serial number already exists" });
      }

      const tire = await Tire.create({
        serialNumber,
        brand,
        condition: condition || "new",
        status: status || "in_stock",
        position: "unassigned",
      });

      res.status(201).json({
        success: true,
        data: tire,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Update tire
   * @route   PUT /api/tires/:id
   * @access  Private
   */
  updateTire = async (req, res, next) => {
    try {
      const { serialNumber, brand, condition, status } = req.body;

      let tire = await Tire.findById(req.params.id);

      if (!tire) {
        return res.status(404).json({ message: "Tire not found" });
      }

      if (serialNumber && serialNumber !== tire.serialNumber) {
        const existingTire = await Tire.findOne({ serialNumber });
        if (existingTire) {
          return res.status(400).json({ message: "Tire with this serial number already exists" });
        }
      }

      const updateData = {};
      if (serialNumber) updateData.serialNumber = serialNumber;
      if (brand) updateData.brand = brand;
      if (condition) updateData.condition = condition;
      if (status) updateData.status = status;

      tire = await Tire.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      }).populate("vehicle", "Immatriculation brand model type");

      // Vérifier maintenance
      if (tire.vehicle && condition) {
        await checkAndUpdateMaintenance(tire.vehicle);
      }

      res.status(200).json({
        success: true,
        data: tire,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Delete tire
   * @route   DELETE /api/tires/:id
   * @access  Private
   */
  deleteTire = async (req, res, next) => {
    try {
      const tire = await Tire.findById(req.params.id);

      if (!tire) {
        return res.status(404).json({ message: "Tire not found" });
      }

      // Check if tire is currently assigned to a vehicle
      if (tire.vehicle && tire.status === "in_use") {
        return res.status(400).json({ message:"Cannot delete tire that is currently assigned to a vehicle. Please unassign it first."});
      }

      await Tire.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Tire deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Assign tire to vehicle
   * @route   PUT /api/tires/:id/assign
   * @access  Private
   */
  assignTire = async (req, res, next) => {
    try {
      const { vehicleId, position } = req.body;

      if (!vehicleId || !position) {
        return res
          .status(400)
          .json({ message: "Vehicle ID and position are required" });
      }

      const tire = await Tire.findById(req.params.id);
      if (!tire) {
        return res.status(404).json({ message: "Tire not found" });
      }

      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      if (tire.status === "in_use" && tire.vehicle) {
        return res
          .status(400)
          .json({ message: "Tire is already assigned to a vehicle" });
      }

      const existingTire = await Tire.findOne({
        vehicle: vehicleId,
        position: position,
        status: "in_use",
      });

      if (existingTire && existingTire._id.toString() !== tire._id.toString()) {
        return res
          .status(400)
          .json({
            message: "This position is already occupied on the vehicle",
          });
      }

      tire.vehicle = vehicleId;
      tire.position = position;
      tire.status = "in_use";
      await tire.save();

      const updatedTire = await Tire.findById(tire._id).populate(
        "vehicle",
        "Immatriculation brand model type"
      );

      // Vérifier maintenance du véhicule
      await checkAndUpdateMaintenance(vehicleId);

      res.status(200).json({
        success: true,
        data: updatedTire,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Unassign tire from vehicle
   * @route   PUT /api/tires/:id/unassign
   * @access  Private
   */
  unassignTire = async (req, res, next) => {
    try {
      const tire = await Tire.findById(req.params.id);

      if (!tire) {
        return res.status(404).json({ message: "Tire not found" });
      }

      const oldVehicleId = tire.vehicle;
      
      tire.vehicle = null;
      tire.position = "unassigned";
      tire.status = "in_stock";
      await tire.save();

      // Vérifier maintenance de l'ancien véhicule
      if (oldVehicleId) {
        await checkAndUpdateMaintenance(oldVehicleId);
      }

      res.status(200).json({
        success: true,
        data: tire,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new TireController();

const Vehicle = require("../models/Vehicle");
const Tire = require("../models/Tire");
const { checkAndUpdateMaintenance } = require("../utils/maintenanceRules");

class VehicleController {
  /**
   * @desc    Get all vehicles
   * @route   GET /api/vehicles
   * @access  Private
   */
  getAllVehicles = async (req, res, next) => {
    try {
      const { type, status } = req.query;
      const filter = {};

      if (type) filter.type = type;
      if (status) filter.status = status;

      const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: vehicles.length,
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Get vehicle by ID
   * @route   GET /api/vehicles/:id
   * @access  Private
   */
  getVehicleById = async (req, res, next) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Create new vehicle
   * @route   POST /api/vehicles
   * @access  Private
   */
  createVehicle = async (req, res, next) => {
    try {
      const vehicle = await Vehicle.create(req.body);

      res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Update vehicle
   * @route   PUT /api/vehicles/:id
   * @access  Private
   */
  updateVehicle = async (req, res, next) => {
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      // Vérifier les règles de maintenance
      await checkAndUpdateMaintenance(vehicle._id);
      // Recharger le véhicule pour avoir le statut à jour
      const updatedVehicle = await Vehicle.findById(vehicle._id);

      res.status(200).json({
        success: true,
        data: updatedVehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Delete vehicle
   * @route   DELETE /api/vehicles/:id
   * @access  Private
   */
  deleteVehicle = async (req, res, next) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      await vehicle.deleteOne();

      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Marquer la maintenance comme effectuée
   * @route   POST /api/vehicles/:id/complete-maintenance
   * @access  Admin only
   */
  completeMaintenance = async (req, res, next) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      // Vérifier si des pneus sont en mauvais état (worn ou critical)
      const badTires = await Tire.find({
        vehicle: vehicle._id,
        status: "in_use",
        condition: { $in: ["worn", "critical"] },
      });

      // Si des pneus sont en mauvais état, les marquer comme "remplacés" (statut: in_stock, condition: good)
      if (badTires.length > 0) {
        // Mettre à jour tous les pneus en mauvais état
        await Tire.updateMany(
          {
            vehicle: vehicle._id,
            status: "in_use",
            condition: { $in: ["worn", "critical"] },
          },
          {
            $set: {
              status: "in_stock",
              condition: "good",
              vehicle: null,
              position: null,
            },
          }
        );
      }

      // Mettre à jour les infos de maintenance
      vehicle.maintenance = {
        lastServiceDate: Date.now(),
        lastServiceMileage: vehicle.mileage,
        nextServiceMileage: vehicle.mileage + 15000,
        nextServiceDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      };
      vehicle.status = "available";
      await vehicle.save();

      res.status(200).json({
        success: true,
        message: "Maintenance effectuée",
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new VehicleController();

const Trip = require("../models/Trip");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const { checkAndUpdateMaintenance } = require("../utils/maintenanceRules");

class TripController {
  /**
   * @desc    Get all trips with search and filter
   * @route   GET /api/trips
   * @access  Private
   */
  getAllTrips = async (req, res, next) => {
    try {
      const { search, status } = req.query;
      let filter = {};

      // Si c'est un chauffeur, il ne voit que ses trajets
      if (req.user.role === "chauffeur") {
        filter.driver = req.user.userId;
      }

      if (status) {
        filter.status = status;
      }

      let trips = await Trip.find(filter)
        .populate("driver", "fullname telephone email")
        .populate("truck", "Immatriculation brand model type")
        .populate("trailer", "Immatriculation brand model type")
        .sort({ createdAt: -1 });

      if (search) {
        const searchLower = search.toLowerCase();
        trips = trips.filter((trip) => {
          return (
            trip.departure.location.toLowerCase().includes(searchLower) ||
            trip.arrival.location.toLowerCase().includes(searchLower) ||
            (trip.driver &&
              trip.driver.fullname.toLowerCase().includes(searchLower)) ||
            (trip.truck &&
              trip.truck.Immatriculation.toLowerCase().includes(searchLower)) ||
            (trip.trailer &&
              trip.trailer.Immatriculation.toLowerCase().includes(searchLower))
          );
        });
      }

      res.status(200).json({
        success: true,
        count: trips.length,
        data: trips,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Obtenir un trajet par ID
   * @route   GET /api/trips/:id
   */
  getTripById = async (req, res, next) => {
    try {
      const trip = await Trip.findById(req.params.id)
        .populate("driver", "fullname telephone")
        .populate("truck", "Immatriculation brand model")
        .populate("trailer", "Immatriculation brand model");

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      res.status(200).json({ success: true, data: trip });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Create new trip
   * @route   POST /api/trips
   * @access  Private (Admin only)
   */
  createTrip = async (req, res, next) => {
    try {
      const {
        driver,
        truck,
        trailer,
        departure,
        arrival,
        status,
        cargoDetails,
      } = req.body;

      const driverUser = await User.findById(driver);
      if (!driverUser) {
        return res.status(404).json({
          success: false,
          message: "Chauffeur non trouvé",
        });
      }
      if (driverUser.role !== "chauffeur") {
        return res.status(400).json({
          success: false,
          message: "L'utilisateur sélectionné n'est pas un chauffeur",
        });
      }

      const truckVehicle = await Vehicle.findById(truck);
      if (!truckVehicle) {
        return res.status(404).json({
          success: false,
          message: "Camion non trouvé",
        });
      }
      if (truckVehicle.type !== "truck") {
        return res.status(400).json({
          success: false,
          message: "Le véhicule sélectionné n'est pas un camion",
        });
      }

      if (trailer) {
        const trailerVehicle = await Vehicle.findById(trailer);
        if (!trailerVehicle) {
          return res.status(404).json({
            success: false,
            message: "Remorque non trouvée",
          });
        }
        if (trailerVehicle.type !== "trailer") {
          return res.status(400).json({
            success: false,
            message: "Le véhicule sélectionné n'est pas une remorque",
          });
        }
      }

      const trip = await Trip.create({
        driver,
        truck,
        trailer: trailer || null,
        departure: {
          location: departure.location,
          date: departure.date,
          mileage: departure.mileage || null,
        },
        arrival: {
          location: arrival.location,
          date: arrival.date || null,
          mileage: arrival.mileage || null,
        },
        status: status || "planned",
        cargoDetails: cargoDetails || null,
      });

      const populatedTrip = await Trip.findById(trip._id)
        .populate("driver", "fullname telephone email")
        .populate("truck", "Immatriculation brand model type")
        .populate("trailer", "Immatriculation brand model type");

      res.status(201).json({
        success: true,
        data: populatedTrip,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Update trip
   * @route   PUT /api/trips/:id
   * @access  Private (Admin can update all, Driver can update specific fields)
   */
  updateTrip = async (req, res, next) => {
    try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trajet non trouvé",
        });
      }

      // Chauffeur ne peut modifier que ses trajets
      if (
        req.user.role === "chauffeur" &&
        trip.driver.toString() !== req.user.userId
      ) {
        return res.status(403).json({
          success: false,
          message: "Non autorisé à modifier ce trajet",
        });
      }

      const {
        driver,
        truck,
        trailer,
        departure,
        arrival,
        status,
        fuelConsumed,
        cargoDetails,
      } = req.body;

      if (driver && driver !== trip.driver.toString()) {
        const driverUser = await User.findById(driver);
        if (!driverUser || driverUser.role !== "chauffeur") {
          return res.status(400).json({
            success: false,
            message: "Chauffeur invalide",
          });
        }
      }

      if (truck && truck !== trip.truck.toString()) {
        const truckVehicle = await Vehicle.findById(truck);
        if (!truckVehicle || truckVehicle.type !== "truck") {
          return res.status(400).json({
            success: false,
            message: "Camion invalide",
          });
        }
      }

      if (trailer) {
        const trailerVehicle = await Vehicle.findById(trailer);
        if (!trailerVehicle || trailerVehicle.type !== "trailer") {
          return res.status(400).json({
            success: false,
            message: "Remorque invalide",
          });
        }
      }

      // Update trip
      const updatedTrip = await Trip.findByIdAndUpdate(
        req.params.id,
        {
          driver: driver || trip.driver,
          truck: truck || trip.truck,
          trailer: trailer !== undefined ? trailer : trip.trailer,
          departure: departure || trip.departure,
          arrival: arrival || trip.arrival,
          status: status || trip.status,
          fuelConsumed:
            fuelConsumed !== undefined ? fuelConsumed : trip.fuelConsumed,
          cargoDetails: cargoDetails || trip.cargoDetails,
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("driver", "fullname telephone email")
        .populate("truck", "Immatriculation brand model type")
        .populate("trailer", "Immatriculation brand model type");

      // Si le trajet est terminé, on met à jour le kilométrage du camion
      if (status === "completed" && arrival?.mileage) {
        await Vehicle.findByIdAndUpdate(trip.truck, {
          mileage: arrival.mileage,
        });
        
        // Vérifier les règles de maintenance 
        await checkAndUpdateMaintenance(trip.truck);
        
        // Recharger le véhicule pour avoir le statut à jour
        const updatedVehicle = await Vehicle.findById(trip.truck);
        
        // Recharger le trajet avec le véhicule mis à jour
        const finalTrip = await Trip.findById(updatedTrip._id)
          .populate("driver", "fullname telephone email")
          .populate("truck", "Immatriculation brand model type")
          .populate("trailer", "Immatriculation brand model type");
          
        return res.status(200).json({
          success: true,
          data: finalTrip,
        });
      }

      res.status(200).json({
        success: true,
        data: updatedTrip,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @desc    Delete trip
   * @route   DELETE /api/trips/:id
   * @access  Private (Admin only)
   */
  deleteTrip = async (req, res, next) => {
    try {
      const trip = await Trip.findById(req.params.id);

      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trajet non trouvé",
        });
      }

      await trip.deleteOne();

      res.status(200).json({
        success: true,
        message: "Trajet supprimé avec succès",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new TripController();

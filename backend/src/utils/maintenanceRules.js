const Vehicle = require('../models/Vehicle');
const Tire = require('../models/Tire');

// Règles de maintenance
const RULES = {
  MAX_KM_SINCE_SERVICE: 1000,
  MAX_DAYS_SINCE_SERVICE: 90
};

/**
 * Vérifie et met à jour automatiquement le statut du véhicule
 */
const checkAndUpdateMaintenance = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle || vehicle.status === 'maintenance') return;

  let needsMaintenance = false;

  // Règle 1: Kilométrage depuis la dernière révision
  if (vehicle.maintenance?.lastServiceMileage !== undefined && vehicle.maintenance?.lastServiceMileage !== null) {
    const kmSinceService = vehicle.mileage - vehicle.maintenance.lastServiceMileage;
    if (kmSinceService >= RULES.MAX_KM_SINCE_SERVICE) {
      needsMaintenance = true;
    }
  }

  // Règle 2: Date dernière révision
  if (vehicle.maintenance?.lastServiceDate) {
    const daysSinceService = Math.floor(
      (Date.now() - new Date(vehicle.maintenance.lastServiceDate)) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceService >= RULES.MAX_DAYS_SINCE_SERVICE) {
      needsMaintenance = true;
    }
  }

  // Règle 3: État des pneus
  const badTires = await Tire.countDocuments({ 
    vehicle: vehicleId, 
    status: 'in_use',
    condition: { $in: ['worn', 'critical'] }
  });
  if (badTires > 0) needsMaintenance = true;

  // Mettre à jour le statut du véhicule si nécessaire
  if (needsMaintenance && vehicle.status !== 'out_of_service') {
    vehicle.status = 'maintenance';
    await vehicle.save();
  }
};

module.exports = { checkAndUpdateMaintenance, RULES };

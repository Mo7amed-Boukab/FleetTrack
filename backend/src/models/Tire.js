const mongoose = require('mongoose');

const tireSchema = new mongoose.Schema({
  
  serialNumber: {
    type: String,
    required: [true, 'Numéro de série requis'],
    unique: true,
    trim: true,
    uppercase: true
  },

  brand: {
    type: String,
    required: [true, 'Marque requise'],
    trim: true
  },

  condition: {
    type: String,
    enum: ['new', 'good', 'worn', 'critical'],
    default: 'new'
  },

  // Assignation au véhicule
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
  },

  position: {
    type: String,
    enum: ['front_left', 'front_right', 'rear_left', 'rear_right', 'spare', 'unassigned'],
    default: 'unassigned'
  },

  status: {
    type: String,
    enum: ['in_stock', 'in_use', 'retired'],
    default: 'in_stock'
  }

}, { timestamps: true });

// Index pour recherche rapide
tireSchema.index({ vehicle: 1, status: 1 });

module.exports = mongoose.model('Tire', tireSchema);

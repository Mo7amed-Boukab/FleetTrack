const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    // --- Assignation ---
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Un chauffeur est requis']
    },
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'Un camion est requis']
    },
    trailer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    },

    // --- Détails du Trajet ---
    departure: {
        location: { type: String, required: true },
        date: { type: Date, required: true },
        mileage: { type: Number } 
    },
    arrival: {
        location: { type: String, required: true },
        date: Date, 
        mileage: { type: Number } 
    },

    // --- Suivi de Mission ---
    status: {
        type: String,
        enum: ['planned', 'in_progress', 'completed', 'cancelled'],
        default: 'planned'
    },

    // --- Suivi Consommation ---
    fuelConsumed: Number, // Litres (Saisi par chauffeur)
    
    //--- Marchandise ---
    cargoDetails: {
        description: String,
        weight: Number // kg
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);

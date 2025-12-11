const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    Immatriculation: {
      type: String,
      required: [true, "Immatriculation requise"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["truck", "trailer"],
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: Number,

    mileage: {
      type: Number,
      default: 0,
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "in_transit", "maintenance", "out_of_service"],
      default: "available",
    },

    maintenance: {
      lastServiceDate: Date,
      lastServiceMileage: Number,
      nextServiceDate: Date,
      nextServiceMileage: Number,
    },
  },
  { timestamps: true }
);

// Méthode virtuelle pour récupérer les pneus assignés
vehicleSchema.virtual("tires", {
  ref: "Tire",
  localField: "_id",
  foreignField: "vehicle",
});

module.exports = mongoose.model("Vehicle", vehicleSchema);

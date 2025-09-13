import mongoose from "mongoose";

const energyConsumptionSchema = new mongoose.Schema({
  household_id: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  energyConsumption: {
    type: Number,
    required: true,
    min: 0
  },
  zone: {
    type: String,
    required: true,
    default: "IN"
  },
  carbonIntensity: {
    type: Number,
    required: true
  },
  carbonFootprint: {
    type: Number,
    required: true
  },
  isEstimated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient querying by household, user and timestamp
energyConsumptionSchema.index({ household_id: 1, timestamp: -1 });
energyConsumptionSchema.index({ userId: 1, timestamp: -1 });

export const EnergyConsumption = mongoose.model("EnergyConsumption", energyConsumptionSchema);

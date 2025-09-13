import mongoose from "mongoose";

const energyUsageSchema = new mongoose.Schema({
  household_id: {
    type: String,
    required: true,
    trim: true
  },
  energy_usage_kwh: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  reading_date: {
    type: Date,
    required: true
  },
  meter_reading: {
    type: Number,
    min: 0
  },
  billing_period: {
    start_date: { type: Date },
    end_date: { type: Date }
  }
}, {
  timestamps: true // This adds created_at automatically
});

// Create indexes
energyUsageSchema.index({ household_id: 1, reading_date: -1 });

const EnergyUsage = mongoose.model("EnergyUsage", energyUsageSchema);
export default EnergyUsage;

import mongoose from "mongoose";

const householdSchema = new mongoose.Schema({
  household_id: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ["apartment", "house", "condo"],
    required: true
  },
  size: {
    type: Number,
    required: true,
    min: 1
  },
  income_level: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true
  },
  location: {
    type: String,
    enum: ["urban", "suburban", "rural"],
    required: true
  },
  primary_resident: {
    type: String,
    trim: true
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipcode: { type: String, trim: true },
    country: { type: String, trim: true, default: "India" }
  }
}, {
  timestamps: true // This adds created_at and updated_at automatically
});

// Create indexes
householdSchema.index({ household_id: 1 }, { unique: true });

const Household = mongoose.model("Household", householdSchema);
export default Household;

import mongoose from "mongoose";

const gamificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  points: { type: Number, required: true },
  icon: String,
  category: { 
    type: String, 
    enum: ["energy_saving", "carbon_reduction", "community", "streak", "milestone"],
    default: "energy_saving"
  },
  requirements: {
    type: mongoose.Schema.Types.Mixed, // Flexible requirements object
    default: {}
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Gamification = mongoose.model("Gamification", gamificationSchema);
export default Gamification;

import mongoose from "mongoose";

const achievementsSchema = new mongoose.Schema({
  achievement_id: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  criteria: {
    type: {
      type: String,
      required: true,
      enum: ["energy_saving", "streak", "efficiency", "participation", "milestone"]
    },
    threshold: {
      type: Number,
      required: true,
      min: 0
    },
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", "lifetime"],
      default: "lifetime"
    }
  }
}, {
  timestamps: true // This adds created_at automatically
});

// Create indexes
achievementsSchema.index({ achievement_id: 1 }, { unique: true });

const Achievements = mongoose.model("Achievements", achievementsSchema);
export default Achievements;

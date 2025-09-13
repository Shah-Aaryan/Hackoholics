import mongoose from "mongoose";

const challengesSchema = new mongoose.Schema({
  challenge_id: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  target_savings: {
    type: Number,
    required: true,
    min: 0
  },
  reward_points: {
    type: Number,
    required: true,
    min: 0
  },
  participants: [{
    type: String // Array of household_ids
  }]
}, {
  timestamps: true // This adds created_at automatically
});

// Create indexes
challengesSchema.index({ challenge_id: 1 }, { unique: true });
challengesSchema.index({ start_date: 1, end_date: 1 });

const Challenges = mongoose.model("Challenges", challengesSchema);
export default Challenges;

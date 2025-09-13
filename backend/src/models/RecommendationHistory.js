import mongoose from "mongoose";

const recommendationHistorySchema = new mongoose.Schema({
  household_id: {
    type: String,
    required: true,
    trim: true
  },
  recommendation_id: {
    type: Number,
    required: true
  },
  recommendation_text: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ["heating", "cooling", "lighting", "appliances", "insulation", "behavior", "other"]
  },
  tried: {
    type: Boolean,
    default: false
  },
  effectiveness: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  satisfaction: {
    type: Number,
    min: 0.0,
    max: 1.0,
    default: 0.0
  },
  estimated_savings: {
    type: Number,
    min: 0,
    default: 0
  },
  actual_savings: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true // This adds created_at and updated_at automatically
});

// Create indexes
recommendationHistorySchema.index({ household_id: 1, created_at: -1 });
recommendationHistorySchema.index({ recommendation_id: 1 });

const RecommendationHistory = mongoose.model("RecommendationHistory", recommendationHistorySchema);
export default RecommendationHistory;

import mongoose from "mongoose";

const recommendationFeedbackSchema = new mongoose.Schema({
  household_id: {
    type: String,
    required: true,
    trim: true
  },
  recommendation_id: {
    type: Number,
    required: true
  },
  effectiveness: {
    type: Number,
    required: true,
    min: 0.0,
    max: 1.0
  },
  satisfaction: {
    type: Number,
    required: true,
    min: 0.0,
    max: 1.0
  },
  comments: {
    type: String,
    trim: true
  },
  would_recommend: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true // This adds created_at and updated_at automatically
});

// Create indexes
recommendationFeedbackSchema.index({ household_id: 1, recommendation_id: 1 }, { unique: true });

const RecommendationFeedback = mongoose.model("RecommendationFeedback", recommendationFeedbackSchema);
export default RecommendationFeedback;

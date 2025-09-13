import mongoose from "mongoose";

const weatherDataSchema = new mongoose.Schema({
  household_id: {
    type: String,
    required: true,
    trim: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  weather_condition: {
    type: String,
    required: true,
    enum: ["sunny", "cloudy", "rainy", "snowy", "foggy", "stormy", "partly_cloudy"]
  },
  recorded_date: {
    type: Date,
    required: true
  },
  location: {
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    city: { type: String, trim: true }
  }
}, {
  timestamps: true // This adds created_at automatically
});

// Create indexes
weatherDataSchema.index({ household_id: 1, recorded_date: -1 });

const WeatherData = mongoose.model("WeatherData", weatherDataSchema);
export default WeatherData;

import mongoose from "mongoose";
import Household from "./Household.js";
import Gamification from "./Gamification.js";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["resident", "admin"], default: "resident" },
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: "Household" },
  points: { type: Number, default: 0 },
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gamification" }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;

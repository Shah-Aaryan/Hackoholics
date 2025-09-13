import mongoose from "mongoose";

const householdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: "India" }
  },
  zone: { type: String, default: "IN" }, // For carbon intensity calculations
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  totalPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Household = mongoose.model("Household", householdSchema);
export default Household;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["resident", "admin"], 
    default: "resident" 
  },
  points: { 
    type: Number, 
    default: 0,
    min: 0
  },
  achievements: [{ 
    type: String // Array of achievement IDs as strings
  }],
  household_id: { 
    type: String, // Link to household as string
    ref: "Household"
  }
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically
  strict: true
});

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ household_id: 1 });

const User = mongoose.model("User", userSchema);
export default User;

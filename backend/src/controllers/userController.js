import User from "../models/User.js";
import Household from "../models/Household.js";

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "resident", household_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password, // In MVP, storing plain text. In production, hash this!
      role,
      household_id
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        household_id: user.household_id,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate('household_id', 'household_id type size income_level location address');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllUsers = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .populate('household_id', 'household_id type size income_level location address')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page * limit < totalUsers,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Update user points (for gamification)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUserPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const { points, action = "add" } = req.body;

    if (!points || points < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid points value is required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update points based on action
    if (action === "add") {
      user.points += points;
    } else if (action === "subtract") {
      user.points = Math.max(0, user.points - points);
    } else if (action === "set") {
      user.points = points;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Points updated successfully",
      data: {
        userId: user._id,
        newPoints: user.points,
        action,
        pointsChanged: action === "set" ? points : (action === "add" ? points : -points)
      }
    });

  } catch (error) {
    console.error("Error in updateUserPoints:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Simple login (MVP - no JWT)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email, password })
      .populate('household_id', 'household_id type size income_level location address');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        household_id: user.household_id
      }
    });

  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

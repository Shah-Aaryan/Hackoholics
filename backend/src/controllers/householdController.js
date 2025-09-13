import Household from "../models/Household.js";

/**
 * Create a new household
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createHousehold = async (req, res) => {
  try {
    const { 
      household_id, 
      type, 
      size, 
      income_level, 
      location, 
      primary_resident, 
      address 
    } = req.body;

    if (!household_id || !type || !size || !income_level || !location) {
      return res.status(400).json({
        success: false,
        message: "household_id, type, size, income_level, and location are required"
      });
    }

    // Check if household already exists
    const existingHousehold = await Household.findOne({ household_id });
    if (existingHousehold) {
      return res.status(400).json({
        success: false,
        message: "Household with this ID already exists"
      });
    }

    // Create new household
    const household = new Household({
      household_id,
      type,
      size,
      income_level,
      location,
      primary_resident,
      address
    });

    await household.save();

    res.status(201).json({
      success: true,
      message: "Household created successfully",
      data: household
    });

  } catch (error) {
    console.error("Error in createHousehold:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get household by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getHouseholdById = async (req, res) => {
  try {
    const { householdId } = req.params;

    const household = await Household.findOne({ household_id: householdId });

    if (!household) {
      return res.status(404).json({
        success: false,
        message: "Household not found"
      });
    }

    res.status(200).json({
      success: true,
      data: household
    });

  } catch (error) {
    console.error("Error in getHouseholdById:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get all households
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllHouseholds = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const households = await Household.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ created_at: -1 });

    const totalHouseholds = await Household.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        households,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalHouseholds / limit),
          totalHouseholds,
          hasNext: page * limit < totalHouseholds,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error("Error in getAllHouseholds:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Update household
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateHousehold = async (req, res) => {
  try {
    const { householdId } = req.params;
    const updateData = req.body;

    const household = await Household.findOneAndUpdate(
      { household_id: householdId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!household) {
      return res.status(404).json({
        success: false,
        message: "Household not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Household updated successfully",
      data: household
    });

  } catch (error) {
    console.error("Error in updateHousehold:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

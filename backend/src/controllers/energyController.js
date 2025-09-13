import { EnergyConsumption } from "../models/EnergyConsumption.js";
import { generateMockEnergyData, generateHistoricalMockData } from "../services/mockEnergyService.js";
import { fetchCarbonIntensity, convertToKgCO2, calculateCarbonFootprint } from "../services/carbonIntensityService.js";

/**
 * Get real-time energy consumption data for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRealTimeEnergyData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { zone = "IN" } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Generate mock energy consumption data
    const mockEnergyData = generateMockEnergyData(userId, zone);

    // Fetch carbon intensity data
    const carbonIntensityResult = await fetchCarbonIntensity(zone);
    
    if (!carbonIntensityResult.success) {
      console.warn("Using fallback carbon intensity data:", carbonIntensityResult.error);
    }

    const carbonIntensityKg = convertToKgCO2(carbonIntensityResult.data.carbonIntensity);
    const carbonFootprint = calculateCarbonFootprint(
      mockEnergyData.energyConsumption, 
      carbonIntensityKg
    );

    // Save to database
    const energyRecord = new EnergyConsumption({
      household_id: "1", // Default household for now
      userId,
      timestamp: mockEnergyData.timestamp,
      energyConsumption: mockEnergyData.energyConsumption,
      zone: mockEnergyData.zone,
      carbonIntensity: carbonIntensityResult.data.carbonIntensity,
      carbonFootprint,
      isEstimated: carbonIntensityResult.data.isEstimated
    });

    await energyRecord.save();

    res.status(200).json({
      success: true,
      data: {
        timestamp: mockEnergyData.timestamp,
        energyConsumption: mockEnergyData.energyConsumption,
        zone: mockEnergyData.zone,
        carbonIntensity: carbonIntensityResult.data.carbonIntensity,
        carbonFootprint: Math.round(carbonFootprint * 100) / 100, // Round to 2 decimal places
        isEstimated: carbonIntensityResult.data.isEstimated,
        additionalData: {
          deviceType: mockEnergyData.deviceType,
          meterId: mockEnergyData.meterId,
          voltage: mockEnergyData.voltage,
          frequency: mockEnergyData.frequency,
          powerFactor: mockEnergyData.powerFactor
        }
      }
    });

  } catch (error) {
    console.error("Error in getRealTimeEnergyData:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get carbon footprint calculation for given energy consumption
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const calculateCarbonFootprintForConsumption = async (req, res) => {
  try {
    const { energyConsumption, zone = "IN" } = req.body;

    if (!energyConsumption || isNaN(energyConsumption) || energyConsumption < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid energy consumption value is required"
      });
    }

    // Fetch carbon intensity data
    const carbonIntensityResult = await fetchCarbonIntensity(zone);
    
    if (!carbonIntensityResult.success) {
      console.warn("Using fallback carbon intensity data:", carbonIntensityResult.error);
    }

    const carbonIntensityKg = convertToKgCO2(carbonIntensityResult.data.carbonIntensity);
    const carbonFootprint = calculateCarbonFootprint(energyConsumption, carbonIntensityKg);

    res.status(200).json({
      success: true,
      data: {
        energyConsumption,
        zone: carbonIntensityResult.data.zone,
        carbonIntensity: carbonIntensityResult.data.carbonIntensity,
        carbonIntensityKg: Math.round(carbonIntensityKg * 1000) / 1000,
        carbonFootprint: Math.round(carbonFootprint * 100) / 100,
        isEstimated: carbonIntensityResult.data.isEstimated,
        calculation: {
          formula: `${energyConsumption} kWh × ${carbonIntensityKg} kgCO₂/kWh = ${Math.round(carbonFootprint * 100) / 100} kgCO₂`,
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error("Error in calculateCarbonFootprintForConsumption:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get historical energy consumption data for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getHistoricalEnergyData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 7, limit = 100 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Query database for historical data
    const historicalData = await EnergyConsumption.find({
      userId,
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

    // If no data in database, generate mock historical data
    if (historicalData.length === 0) {
      const mockHistoricalData = generateHistoricalMockData(userId, parseInt(days));
      
      // Save mock data to database
      const recordsToSave = mockHistoricalData.map(data => ({
        userId: data.userId,
        timestamp: data.timestamp,
        energyConsumption: data.energyConsumption,
        zone: data.zone,
        carbonIntensity: 620, // Default fallback
        carbonFootprint: data.energyConsumption * 0.62, // Using default conversion
        isEstimated: true
      }));

      await EnergyConsumption.insertMany(recordsToSave);
      
      res.status(200).json({
        success: true,
        data: {
          records: mockHistoricalData,
          totalRecords: mockHistoricalData.length,
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
          },
          isMockData: true
        }
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          records: historicalData,
          totalRecords: historicalData.length,
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
          },
          isMockData: false
        }
      });
    }

  } catch (error) {
    console.error("Error in getHistoricalEnergyData:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get carbon intensity data for a specific zone
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getCarbonIntensity = async (req, res) => {
  try {
    const { zone = "IN" } = req.query;

    const carbonIntensityResult = await fetchCarbonIntensity(zone);

    res.status(200).json({
      success: true,
      data: carbonIntensityResult.data,
      apiStatus: carbonIntensityResult.success ? "live" : "fallback"
    });

  } catch (error) {
    console.error("Error in getCarbonIntensity:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

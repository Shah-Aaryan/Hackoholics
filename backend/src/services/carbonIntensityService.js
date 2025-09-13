import axios from "axios";

const ELECTRICITY_MAPS_API_URL = "https://api.electricitymaps.com/v3/carbon-intensity/latest";
const API_KEY = "vDgTJ2wQVE5Hwgv8elab";

/**
 * Fetch carbon intensity data from Electricity Maps API
 * @param {string} zone - The zone code (e.g., 'IN', 'DE', 'US')
 * @returns {Promise<Object>} Carbon intensity data
 */
export const fetchCarbonIntensity = async (zone = "IN") => {
  try {
    const response = await axios.get(`${ELECTRICITY_MAPS_API_URL}?zone=${zone}`, {
      headers: {
        'auth-token': API_KEY
      },
      timeout: 10000 // 10 second timeout
    });

    return {
      success: true,
      data: {
        zone: response.data.zone,
        carbonIntensity: response.data.carbonIntensity, // gCO2eq/kWh
        datetime: response.data.datetime,
        isEstimated: response.data.isEstimated || false
      }
    };
  } catch (error) {
    console.error("Error fetching carbon intensity:", error.message);
    
    // Return fallback data if API fails
    return {
      success: false,
      error: error.message,
      data: {
        zone: zone,
        carbonIntensity: 620, // Default fallback for India
        datetime: new Date().toISOString(),
        isEstimated: true
      }
    };
  }
};

/**
 * Convert carbon intensity from gCO2eq/kWh to kgCO2eq/kWh
 * @param {number} carbonIntensityGrams - Carbon intensity in gCO2eq/kWh
 * @returns {number} Carbon intensity in kgCO2eq/kWh
 */
export const convertToKgCO2 = (carbonIntensityGrams) => {
  return carbonIntensityGrams / 1000;
};

/**
 * Calculate carbon footprint
 * @param {number} energyConsumption - Energy consumption in kWh
 * @param {number} carbonIntensityKg - Carbon intensity in kgCO2eq/kWh
 * @returns {number} Carbon footprint in kgCO2
 */
export const calculateCarbonFootprint = (energyConsumption, carbonIntensityKg) => {
  return energyConsumption * carbonIntensityKg;
};

// Approximate CO2 emission factor (kg CO2 per kWh)
export const CARBON_FACTOR = 0.92;

/**
 * Calculate carbon footprint based on energy usage.
 * @param {number} usage - electricity usage in kWh
 * @returns {number} carbon footprint in kg CO2
 */
export function calculateCarbonFootprint(usage) {
  return usage * CARBON_FACTOR;
}

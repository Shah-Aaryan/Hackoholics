/**
 * Mock service to simulate real-time energy consumption data
 * In a real implementation, this would connect to smart meters or utility APIs
 */

/**
 * Generate mock energy consumption data for a household
 * @param {string} userId - User ID
 * @param {string} zone - Zone code (default: 'IN')
 * @returns {Object} Mock energy consumption data
 */
export const generateMockEnergyData = (userId, zone = "IN") => {
  // Simulate realistic energy consumption patterns
  const baseConsumption = 8; // Base consumption in kWh
  const variation = Math.random() * 8; // Random variation 0-8 kWh
  const timeOfDay = new Date().getHours();
  
  // Simulate higher consumption during peak hours (6-9 AM, 6-9 PM)
  let peakMultiplier = 1;
  if ((timeOfDay >= 6 && timeOfDay <= 9) || (timeOfDay >= 18 && timeOfDay <= 21)) {
    peakMultiplier = 1.5;
  }
  
  // Simulate lower consumption during night hours (11 PM - 5 AM)
  if (timeOfDay >= 23 || timeOfDay <= 5) {
    peakMultiplier = 0.6;
  }
  
  const energyConsumption = Math.round((baseConsumption + variation) * peakMultiplier * 10) / 10;
  
  return {
    userId,
    timestamp: new Date().toISOString(),
    energyConsumption,
    zone,
    deviceType: "smart_meter",
    meterId: `METER_${userId.slice(-6)}_${Date.now()}`,
    voltage: 220 + (Math.random() * 20 - 10), // Simulate voltage variation
    frequency: 50 + (Math.random() * 0.2 - 0.1), // Simulate frequency variation
    powerFactor: 0.85 + (Math.random() * 0.1) // Simulate power factor
  };
};

/**
 * Generate historical mock data for a user
 * @param {string} userId - User ID
 * @param {number} days - Number of days of historical data to generate
 * @param {string} zone - Zone code
 * @returns {Array} Array of historical energy consumption data
 */
export const generateHistoricalMockData = (userId, days = 7, zone = "IN") => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate multiple readings per day (every 4 hours)
    for (let hour = 0; hour < 24; hour += 4) {
      const timestamp = new Date(date);
      timestamp.setHours(hour, 0, 0, 0);
      
      const baseConsumption = 6 + Math.random() * 6; // 6-12 kWh base
      const variation = Math.random() * 4; // 0-4 kWh variation
      
      // Peak hours simulation
      let peakMultiplier = 1;
      if ((hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 21)) {
        peakMultiplier = 1.4;
      } else if (hour >= 23 || hour <= 5) {
        peakMultiplier = 0.7;
      }
      
      const energyConsumption = Math.round((baseConsumption + variation) * peakMultiplier * 10) / 10;
      
      data.push({
        userId,
        timestamp: timestamp.toISOString(),
        energyConsumption,
        zone,
        deviceType: "smart_meter",
        meterId: `METER_${userId.slice(-6)}_${timestamp.getTime()}`
      });
    }
  }
  
  return data.reverse(); // Return in chronological order
};

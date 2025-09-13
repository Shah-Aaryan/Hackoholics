import express from "express";
import {
  getRealTimeEnergyData,
  calculateCarbonFootprintForConsumption,
  getHistoricalEnergyData,
  getCarbonIntensity
} from "../controllers/energyController.js";

const router = express.Router();

/**
 * @route GET /api/energy/realtime/:userId
 * @desc Get real-time energy consumption data for a user
 * @access Public (in real app, this would be protected)
 */
router.get("/realtime/:userId", getRealTimeEnergyData);

/**
 * @route POST /api/energy/calculate-carbon-footprint
 * @desc Calculate carbon footprint for given energy consumption
 * @access Public (in real app, this would be protected)
 */
router.post("/calculate-carbon-footprint", calculateCarbonFootprintForConsumption);

/**
 * @route GET /api/energy/historical/:userId
 * @desc Get historical energy consumption data for a user
 * @access Public (in real app, this would be protected)
 */
router.get("/historical/:userId", getHistoricalEnergyData);

/**
 * @route GET /api/energy/carbon-intensity
 * @desc Get carbon intensity data for a specific zone
 * @access Public
 */
router.get("/carbon-intensity", getCarbonIntensity);

export default router;

import express from "express";
import {
  createHousehold,
  getHouseholdById,
  getAllHouseholds,
  updateHousehold
} from "../controllers/householdController.js";

const router = express.Router();

/**
 * @route POST /api/households
 * @desc Create a new household
 * @access Public (MVP - no auth required)
 */
router.post("/", createHousehold);

/**
 * @route GET /api/households/:householdId
 * @desc Get household by ID
 * @access Public (MVP - no auth required)
 */
router.get("/:householdId", getHouseholdById);

/**
 * @route GET /api/households
 * @desc Get all households with pagination
 * @access Public (MVP - no auth required)
 */
router.get("/", getAllHouseholds);

/**
 * @route PUT /api/households/:householdId
 * @desc Update household
 * @access Public (MVP - no auth required)
 */
router.put("/:householdId", updateHousehold);

export default router;

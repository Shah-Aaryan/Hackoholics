import express from "express";
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUserPoints,
  loginUser
} from "../controllers/userController.js";

const router = express.Router();

/**
 * @route POST /api/users/register
 * @desc Create a new user
 * @access Public (MVP - no auth required)
 */
router.post("/register", createUser);

/**
 * @route POST /api/users/login
 * @desc Login user (MVP - simple email/password check)
 * @access Public
 */
router.post("/login", loginUser);

/**
 * @route GET /api/users/:userId
 * @desc Get user by ID
 * @access Public (MVP - no auth required)
 */
router.get("/:userId", getUserById);

/**
 * @route GET /api/users
 * @desc Get all users with pagination
 * @access Public (MVP - no auth required)
 */
router.get("/", getAllUsers);

/**
 * @route PUT /api/users/:userId/points
 * @desc Update user points
 * @access Public (MVP - no auth required)
 */
router.put("/:userId/points", updateUserPoints);

export default router;

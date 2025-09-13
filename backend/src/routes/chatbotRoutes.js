import express from "express";
import {
  sendMessage,
  getSuggestions,
  getChatbotInfo
} from "../controllers/chatbot.controller.js";

const router = express.Router();

/**
 * @route POST /api/chatbot/message
 * @desc Send a message to the chatbot
 * @access Public (MVP - no auth required)
 */
router.post("/message", sendMessage);

/**
 * @route GET /api/chatbot/suggestions
 * @desc Get chatbot suggestion messages
 * @access Public
 */
router.get("/suggestions", getSuggestions);

/**
 * @route GET /api/chatbot/info
 * @desc Get chatbot information and capabilities
 * @access Public
 */
router.get("/info", getChatbotInfo);

export default router;

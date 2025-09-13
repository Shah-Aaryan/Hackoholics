import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../constants.js";

// Debug: Check if API key is loaded
console.log("Gemini API Key loaded:", GEMINI_API_KEY ? "Yes" : "No");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generate chatbot response using Gemini AI
 * @param {string} userMessage - User's message
 * @param {string} context - Additional context (user data, energy data, etc.)
 * @returns {Object} Chatbot response
 */
export async function generateChatbotResponse(userMessage, context = "") {
  // Check if API key is valid
  if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 10) {
    console.log("Using fallback responses - API key not available");
    return getFallbackResponse(userMessage);
  }

  try {
    const systemPrompt = `
You are an AI assistant for an energy management and carbon footprint tracking application. 
You help users understand their energy consumption, carbon footprint, and provide recommendations for energy saving.

Context about the application:
- Users can upload electricity bills and get OCR analysis
- The system tracks energy consumption and calculates carbon footprint
- Users can view their energy usage trends and get personalized recommendations
- There's a gamification system with points and achievements
- Users can participate in energy-saving challenges

Context about the user: ${context}

Guidelines for responses:
1. Be helpful, friendly, and encouraging
2. Focus on energy efficiency, sustainability, and carbon footprint reduction
3. Provide specific, actionable advice when possible
4. Use simple language that anyone can understand
5. If asked about features, explain how they work
6. If asked about data, explain what information is tracked and why
7. Always encourage sustainable energy practices
8. Keep responses concise but informative (2-3 sentences max)

User's message: "${userMessage}"

Respond as a helpful energy management assistant:`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      message: text.trim(),
      timestamp: new Date().toISOString(),
      model: "gemini-1.5-flash"
    };

  } catch (error) {
    console.error("Error generating chatbot response:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      status: error.status
    });
    
    // Use fallback response for API errors
    return getFallbackResponse(userMessage);
  }
}

// Fallback responses when API is not available
function getFallbackResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('energy') || message.includes('save') || message.includes('reduce')) {
    return {
      success: true,
      message: "Great question! To reduce your energy consumption, try these tips: 1) Use LED bulbs instead of incandescent ones, 2) Set your thermostat 2-3°C higher in summer, 3) Unplug devices when not in use, 4) Use natural light during the day. These small changes can make a big difference!",
      timestamp: new Date().toISOString(),
      model: "fallback"
    };
  }
  
  if (message.includes('carbon') || message.includes('footprint')) {
    return {
      success: true,
      message: "Your carbon footprint is calculated based on your energy consumption and the carbon intensity of your region. The app tracks your electricity usage and multiplies it by the local carbon intensity factor to give you an accurate measurement. Reducing energy use directly reduces your carbon footprint!",
      timestamp: new Date().toISOString(),
      model: "fallback"
    };
  }
  
  if (message.includes('bill') || message.includes('upload') || message.includes('ocr')) {
    return {
      success: true,
      message: "To upload your electricity bill, go to the Bills page and click 'Upload Bill Image'. The app uses OCR technology to extract your energy consumption data and then calculates your carbon footprint automatically. It's that simple!",
      timestamp: new Date().toISOString(),
      model: "fallback"
    };
  }
  
  if (message.includes('points') || message.includes('earn') || message.includes('gamification')) {
    return {
      success: true,
      message: "You can earn points by reducing your energy consumption, participating in challenges, and following energy-saving recommendations. Points unlock achievements and help you climb the leaderboard. Check the Gamification page to see available challenges!",
      timestamp: new Date().toISOString(),
      model: "fallback"
    };
  }
  
  // Default response
  return {
    success: true,
    message: "I'm here to help you with energy management and sustainability! You can ask me about reducing energy consumption, understanding your carbon footprint, uploading bills, earning points, or any other features of the app. What would you like to know?",
    timestamp: new Date().toISOString(),
    model: "fallback"
  };
}

/**
 * Get context about user's energy data for personalized responses
 * @param {string} userId - User ID
 * @returns {string} Context string
 */
export async function getUserContext(userId) {
  try {
    // This would typically fetch user's recent energy data, points, etc.
    // For now, return a basic context
    return `User ID: ${userId}. This user is using the energy management system.`;
  } catch (error) {
    console.error("Error getting user context:", error);
    return "User context unavailable.";
  }
}

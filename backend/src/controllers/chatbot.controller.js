import { generateChatbotResponse, getUserContext } from "../services/chatbot.service.js";

/**
 * Handle chatbot message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // Get user context for personalized responses
    const context = userId ? await getUserContext(userId) : "";

    // Generate AI response
    const aiResponse = await generateChatbotResponse(message.trim(), context);

    res.status(200).json({
      success: true,
      data: {
        userMessage: message.trim(),
        aiResponse: aiResponse.message,
        timestamp: aiResponse.timestamp,
        model: aiResponse.model,
        success: aiResponse.success
      }
    });

  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get chatbot suggestions/quick replies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "How can I reduce my energy consumption?",
      "What is my carbon footprint?",
      "How do I upload my electricity bill?",
      "What are energy-saving tips?",
      "How do I earn points?",
      "What challenges are available?",
      "How does the OCR feature work?",
      "What is carbon intensity?"
    ];

    res.status(200).json({
      success: true,
      data: {
        suggestions
      }
    });

  } catch (error) {
    console.error("Error in getSuggestions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Get chatbot status and capabilities
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getChatbotInfo = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        name: "Energy Assistant",
        description: "Your AI-powered energy management assistant",
        capabilities: [
          "Answer questions about energy consumption",
          "Provide energy-saving tips",
          "Explain carbon footprint calculations",
          "Help with bill upload and OCR",
          "Guide through app features",
          "Provide personalized recommendations"
        ],
        model: "Gemini 1.5 Flash",
        status: "online"
      }
    });

  } catch (error) {
    console.error("Error in getChatbotInfo:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

# 🤖 Chatbot Integration with Gemini AI

## Overview
The chatbot system integrates Gemini AI to provide intelligent responses about energy management, carbon footprint, and sustainability tips.

## Backend Components

### 1. Chatbot Service (`src/services/chatbot.service.js`)
- **Purpose**: Handles Gemini AI integration
- **Features**:
  - Generates contextual responses using Gemini 1.5 Flash
  - Provides personalized advice based on user context
  - Handles fallback responses if AI fails

### 2. Chatbot Controller (`src/controllers/chatbot.controller.js`)
- **Endpoints**:
  - `POST /api/chatbot/message` - Send message to chatbot
  - `GET /api/chatbot/suggestions` - Get quick reply suggestions
  - `GET /api/chatbot/info` - Get chatbot capabilities

### 3. Chatbot Routes (`src/routes/chatbotRoutes.js`)
- **Route Configuration**: Defines all chatbot API endpoints
- **Middleware**: Handles request/response processing

## Frontend Components

### 1. Chatbot Component (`frontend/src/components/Chatbot.tsx`)
- **Features**:
  - Real-time messaging interface
  - Integration with backend API
  - Fallback responses for offline mode
  - Quick question suggestions
  - Typing indicators

### 2. Integration
- **API Calls**: Uses fetch to communicate with backend
- **Error Handling**: Graceful fallback to mock responses
- **User Experience**: Smooth chat interface with animations

## API Endpoints

### Send Message
```bash
POST /api/chatbot/message
Content-Type: application/json

{
  "message": "How can I reduce my energy consumption?",
  "userId": "68c4f56fd13e6b30224f402c"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userMessage": "How can I reduce my energy consumption?",
    "aiResponse": "Here are some effective ways to reduce your energy consumption...",
    "timestamp": "2025-09-13T10:00:00.000Z",
    "model": "gemini-1.5-flash",
    "success": true
  }
}
```

### Get Suggestions
```bash
GET /api/chatbot/suggestions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "How can I reduce my energy consumption?",
      "What is my carbon footprint?",
      "How do I upload my electricity bill?",
      "What are energy-saving tips?",
      "How do I earn points?",
      "What challenges are available?",
      "How does the OCR feature work?",
      "What is carbon intensity?"
    ]
  }
}
```

### Get Chatbot Info
```bash
GET /api/chatbot/info
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Energy Assistant",
    "description": "Your AI-powered energy management assistant",
    "capabilities": [
      "Answer questions about energy consumption",
      "Provide energy-saving tips",
      "Explain carbon footprint calculations",
      "Help with bill upload and OCR",
      "Guide through app features",
      "Provide personalized recommendations"
    ],
    "model": "Gemini 1.5 Flash",
    "status": "online"
  }
}
```

## Setup Instructions

### 1. Backend Setup
```bash
# Install dependencies (if not already installed)
npm install @google/generative-ai

# Set up environment variables
# Add to .env file:
GEMINI_API_KEY=your_gemini_api_key_here

# Start backend server
npm run dev
```

### 2. Frontend Setup
```bash
# The chatbot component is already integrated
# No additional setup required
```

### 3. Testing
```bash
# Test backend API
curl -X GET "http://localhost:8000/api/chatbot/info"

# Test message sending
curl -X POST "http://localhost:8000/api/chatbot/message" \
  -H "Content-Type: application/json" \
  -d '{"message": "How can I save energy?", "userId": "68c4f56fd13e6b30224f402c"}'
```

## Features

### 🤖 AI-Powered Responses
- Uses Gemini 1.5 Flash for intelligent responses
- Context-aware answers about energy management
- Personalized recommendations based on user data

### 💬 Interactive Chat Interface
- Real-time messaging
- Quick question suggestions
- Typing indicators
- Smooth animations

### 🔄 Fallback System
- Graceful handling of API failures
- Mock responses when backend is unavailable
- Error recovery mechanisms

### 🎯 Energy-Focused
- Specialized knowledge about energy efficiency
- Carbon footprint explanations
- Sustainability tips and advice
- App feature guidance

## Usage Examples

### User Questions the Chatbot Can Answer:
- "How can I reduce my energy consumption?"
- "What is my carbon footprint?"
- "How do I upload my electricity bill?"
- "What are the best energy-saving tips?"
- "How do I earn points in the app?"
- "What challenges are available?"
- "How does the OCR feature work?"
- "What is carbon intensity?"

### Expected Responses:
- Detailed, actionable advice
- Step-by-step instructions
- Encouraging and supportive tone
- Focus on sustainability and efficiency

## Error Handling

### Backend Errors:
- API key issues
- Gemini service unavailable
- Network connectivity problems
- Invalid request format

### Frontend Errors:
- Backend server unavailable
- Network connection issues
- API response errors
- User input validation

## Future Enhancements

1. **User Context Integration**: Use actual user data for personalized responses
2. **Conversation History**: Store and retrieve chat history
3. **Voice Input**: Add speech-to-text capabilities
4. **Rich Media**: Support for images and documents
5. **Multi-language**: Support for multiple languages
6. **Analytics**: Track user interactions and popular questions

## Troubleshooting

### Common Issues:
1. **"Cannot find module" errors**: Run `npm install` in backend directory
2. **API key errors**: Ensure GEMINI_API_KEY is set in .env file
3. **CORS errors**: Check CORS configuration in app.js
4. **Frontend not connecting**: Verify backend server is running on port 8000

### Debug Steps:
1. Check backend server logs
2. Verify environment variables
3. Test API endpoints with curl
4. Check browser console for errors
5. Verify network connectivity

## Security Considerations

- API keys are stored in environment variables
- User input is sanitized before sending to AI
- Rate limiting should be implemented for production
- User data is not stored permanently in chat history

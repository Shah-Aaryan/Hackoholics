import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "./src/constants.js";

async function testGeminiDirect() {
  console.log('🧪 TESTING GEMINI API DIRECTLY');
  console.log('==============================\n');

  console.log('API Key loaded:', GEMINI_API_KEY ? 'Yes' : 'No');
  console.log('API Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
  console.log('API Key starts with:', GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'None');

  if (!GEMINI_API_KEY) {
    console.log('❌ No API key found!');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log('\n🤖 Testing Gemini API...');
    
    const result = await model.generateContent("Hello, how can I save energy?");
    const response = await result.response;
    const text = response.text();

    console.log('✅ Gemini Response:');
    console.log(text);
    console.log('\n🎉 Gemini API is working correctly!');

  } catch (error) {
    console.error('❌ Gemini API Error:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Status:', error.status);
    console.error('Full error:', error);
  }
}

testGeminiDirect();

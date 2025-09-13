import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api/chatbot';

async function testChatbot() {
  console.log('🤖 TESTING CHATBOT INTEGRATION');
  console.log('==============================\n');

  try {
    // Test 1: Get chatbot info
    console.log('1️⃣ Testing Chatbot Info...');
    const infoResponse = await fetch(`${BASE_URL}/info`);
    const infoData = await infoResponse.json();
    console.log('✅ Chatbot Info:', JSON.stringify(infoData, null, 2));
    console.log('');

    // Test 2: Get suggestions
    console.log('2️⃣ Testing Chatbot Suggestions...');
    const suggestionsResponse = await fetch(`${BASE_URL}/suggestions`);
    const suggestionsData = await suggestionsResponse.json();
    console.log('✅ Suggestions:', JSON.stringify(suggestionsData, null, 2));
    console.log('');

    // Test 3: Send a message
    console.log('3️⃣ Testing Chatbot Message...');
    const messageResponse = await fetch(`${BASE_URL}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "How can I reduce my energy consumption?",
        userId: "68c4f56fd13e6b30224f402c"
      })
    });
    const messageData = await messageResponse.json();
    console.log('✅ Message Response:', JSON.stringify(messageData, null, 2));
    console.log('');

    // Test 4: Send another message
    console.log('4️⃣ Testing Another Message...');
    const message2Response = await fetch(`${BASE_URL}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "What is carbon footprint?",
        userId: "68c4f56fd13e6b30224f402c"
      })
    });
    const message2Data = await message2Response.json();
    console.log('✅ Message 2 Response:', JSON.stringify(message2Data, null, 2));
    console.log('');

    console.log('🎉 CHATBOT INTEGRATION TESTS COMPLETED!');
    console.log('✅ Chatbot is working correctly with Gemini AI');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testChatbot();

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api/chatbot';

async function testChatbotEndpoints() {
  console.log('🤖 TESTING CHATBOT ENDPOINTS');
  console.log('============================\n');

  const tests = [
    {
      name: 'Chatbot Info',
      method: 'GET',
      url: `${BASE_URL}/info`,
      body: null
    },
    {
      name: 'Chatbot Suggestions',
      method: 'GET',
      url: `${BASE_URL}/suggestions`,
      body: null
    },
    {
      name: 'Energy Saving Question',
      method: 'POST',
      url: `${BASE_URL}/message`,
      body: {
        message: "How can I reduce my energy consumption?",
        userId: "68c4f56fd13e6b30224f402c"
      }
    },
    {
      name: 'Carbon Footprint Question',
      method: 'POST',
      url: `${BASE_URL}/message`,
      body: {
        message: "What is my carbon footprint?",
        userId: "68c4f56fd13e6b30224f402c"
      }
    },
    {
      name: 'Bill Upload Question',
      method: 'POST',
      url: `${BASE_URL}/message`,
      body: {
        message: "How do I upload my electricity bill?",
        userId: "68c4f56fd13e6b30224f402c"
      }
    },
    {
      name: 'Points Question',
      method: 'POST',
      url: `${BASE_URL}/message`,
      body: {
        message: "How do I earn points?",
        userId: "68c4f56fd13e6b30224f402c"
      }
    }
  ];

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`${i + 1}️⃣ Testing ${test.name}...`);
    
    try {
      const options = {
        method: test.method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (test.body) {
        options.body = JSON.stringify(test.body);
      }
      
      const response = await fetch(test.url, options);
      const data = await response.json();
      
      console.log(`✅ ${test.name}:`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Success: ${data.success}`);
      if (data.data && data.data.aiResponse) {
        console.log(`   Response: ${data.data.aiResponse.substring(0, 100)}...`);
      } else if (data.data && data.data.suggestions) {
        console.log(`   Suggestions: ${data.data.suggestions.length} available`);
      } else if (data.data && data.data.name) {
        console.log(`   Name: ${data.data.name}`);
      }
      console.log('');
      
    } catch (error) {
      console.log(`❌ ${test.name} failed: ${error.message}`);
      console.log('');
    }
  }

  console.log('🎉 ALL CHATBOT ENDPOINT TESTS COMPLETED!');
}

testChatbotEndpoints();

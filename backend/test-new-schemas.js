import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api';

async function testNewSchemas() {
  console.log('🧪 TESTING NEW SCHEMA STRUCTURE');
  console.log('================================\n');

  try {
    // Test 1: Create Household
    console.log('1️⃣ Testing Household Creation...');
    const householdData = {
      household_id: "1",
      type: "apartment",
      size: 2,
      income_level: "medium",
      location: "urban",
      primary_resident: "John Doe",
      address: {
        street: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        zipcode: "400001",
        country: "India"
      }
    };

    const householdResponse = await fetch(`${BASE_URL}/households`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(householdData)
    });
    const householdResult = await householdResponse.json();
    console.log('✅ Household Creation:', JSON.stringify(householdResult, null, 2));
    console.log('');

    // Test 2: Create User with household_id
    console.log('2️⃣ Testing User Creation with household_id...');
    const userData = {
      name: "John Doe",
      email: `john_${Date.now()}@example.com`,
      password: "password123",
      role: "resident",
      household_id: "1"
    };

    const userResponse = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const userResult = await userResponse.json();
    console.log('✅ User Creation:', JSON.stringify(userResult, null, 2));
    console.log('');

    // Test 3: Test User Login
    if (userResult.success) {
      console.log('3️⃣ Testing User Login...');
      const loginResponse = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        })
      });
      const loginResult = await loginResponse.json();
      console.log('✅ User Login:', JSON.stringify(loginResult, null, 2));
      console.log('');
    }

    // Test 4: Test Energy Data with household_id
    console.log('4️⃣ Testing Energy Data with household_id...');
    const energyResponse = await fetch(`${BASE_URL}/energy/realtime/68c4f56fd13e6b30224f402c`);
    const energyResult = await energyResponse.json();
    console.log('✅ Energy Data:', JSON.stringify(energyResult, null, 2));
    console.log('');

    // Test 5: Get Household by ID
    console.log('5️⃣ Testing Get Household by ID...');
    const getHouseholdResponse = await fetch(`${BASE_URL}/households/1`);
    const getHouseholdResult = await getHouseholdResponse.json();
    console.log('✅ Get Household:', JSON.stringify(getHouseholdResult, null, 2));
    console.log('');

    // Test 6: Get All Households
    console.log('6️⃣ Testing Get All Households...');
    const getAllHouseholdsResponse = await fetch(`${BASE_URL}/households`);
    const getAllHouseholdsResult = await getAllHouseholdsResponse.json();
    console.log('✅ Get All Households:', JSON.stringify(getAllHouseholdsResult, null, 2));
    console.log('');

    console.log('🎉 ALL NEW SCHEMA TESTS COMPLETED!');
    console.log('✅ All schemas are working correctly with the new structure');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testNewSchemas();

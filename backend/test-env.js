import dotenv from "dotenv";
dotenv.config();

console.log('🔧 TESTING ENVIRONMENT VARIABLES');
console.log('================================\n');

console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Loaded' : 'Not loaded');
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
console.log('GEMINI_API_KEY starts with:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'None');

console.log('\nMONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Not loaded');
console.log('PORT:', process.env.PORT || 'Default (8000)');

console.log('\nAll environment variables:');
console.log(process.env);

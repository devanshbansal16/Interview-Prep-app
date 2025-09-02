const axios = require('axios');

const testBackend = async () => {
  try {
    console.log('🧪 Testing backend server...');

    // Test if server is running
    const healthResponse = await axios.get('http://localhost:8000/health');
    console.log('✅ Server is running:', healthResponse.data);

    // Test if database is connected
    const testResponse = await axios.get('http://localhost:8000/test');
    console.log('✅ Test endpoint working:', testResponse.data);

    console.log('🎉 Backend is working correctly!');
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('💡 Make sure:');
    console.log('   1. Backend server is running (npm start)');
    console.log('   2. MongoDB is connected');
    console.log('   3. .env file exists with proper configuration');
  }
};

testBackend();

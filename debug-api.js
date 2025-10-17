// Debug script to test API connection
// Run this in your browser console on the Vercel site

console.log('🔍 Debugging API Connection...');

// Check if environment variable is loaded
console.log('Environment check:');
console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

// Test API connection
async function testApi() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5218';
  console.log('Testing API URL:', apiUrl);
  
  try {
    const response = await fetch(`${apiUrl}/api/products`);
    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response Headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Data:', data);
    } else {
      console.log('❌ API Error:', response.statusText);
    }
  } catch (error) {
    console.log('❌ Fetch Error:', error.message);
    console.log('❌ Error Details:', error);
  }
}

// Test registration endpoint
async function testRegistration() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5218';
  console.log('Testing Registration URL:', `${apiUrl}/api/auth/register`);
  
  try {
    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: 'debug-test',
        Email: 'debug@test.com',
        Password: 'test123'
      })
    });
    
    console.log('✅ Registration Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Registration Success:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Registration Error:', response.status, errorText);
    }
  } catch (error) {
    console.log('❌ Registration Fetch Error:', error.message);
  }
}

// Run tests
testApi();
testRegistration();

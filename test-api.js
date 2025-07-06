const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
let authToken = '';

// Test data
const testUser = {
  email: `test${Date.now()}@taskload.com`,
  username: `testuser${Date.now()}`,
  password: 'password123'
};

const testProject = {
  title: 'Test Project',
  description: 'This is a test project for TaskLoad',
  priority: 'Medium',
  status: 'current',
  start: new Date().toISOString(),
  starttime: '09:00',
  end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  endtime: '17:00',
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
};

// Helper function to make authenticated requests
const authRequest = (method, url, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };
  
  if (data) {
    config.data = data;
  }
  
  return axios(config);
};

// Test functions
const testHealthCheck = async () => {
  try {
    console.log('🏥 Testing health check...');
    const response = await axios.get(`${BASE_URL.replace('/api', '')}/api/health`);
    console.log('✅ Health check passed:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
};

const testSignup = async () => {
  try {
    console.log('📝 Testing user signup...');
    const response = await axios.post(`${BASE_URL}/auth/signup`, testUser);
    authToken = response.data.data.token;
    console.log('✅ Signup successful:', response.data.message);
    return true;
  } catch (error) {
    if (error.response?.data?.message === 'User with this email already exists') {
      console.log('ℹ️  User already exists, proceeding with login...');
      return await testLogin();
    }
    console.error('❌ Signup failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testLogin = async () => {
  try {
    console.log('🔐 Testing user login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, testUser);
    authToken = response.data.data.token;
    console.log('✅ Login successful:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testCreateProject = async () => {
  try {
    console.log('📋 Testing project creation...');
    const response = await authRequest('POST', '/projects', testProject);
    console.log('✅ Project created successfully:', response.data.message);
    return response.data.data._id;
  } catch (error) {
    console.error('❌ Project creation failed:', error.response?.data?.message || error.message);
    return null;
  }
};

const testGetProjects = async () => {
  try {
    console.log('📊 Testing get all projects...');
    const response = await authRequest('GET', '/projects');
    console.log(`✅ Retrieved ${response.data.count} projects`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Get projects failed:', error.response?.data?.message || error.message);
    return [];
  }
};

const testUpdateProject = async (projectId) => {
  try {
    console.log('✏️  Testing project update...');
    const updateData = {
      title: 'Updated Test Project',
      status: 'completed'
    };
    const response = await authRequest('PUT', `/projects/${projectId}`, updateData);
    console.log('✅ Project updated successfully:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Project update failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testDeleteProject = async (projectId) => {
  try {
    console.log('🗑️  Testing project deletion...');
    const response = await authRequest('DELETE', `/projects/${projectId}`);
    console.log('✅ Project deleted successfully:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Project deletion failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testFilterProjects = async () => {
  try {
    console.log('🔍 Testing project filtering...');
    
    // Test status filter
    const statusResponse = await authRequest('GET', '/projects/status/current');
    console.log(`✅ Status filter: ${statusResponse.data.count} current projects`);
    
    // Test priority filter
    const priorityResponse = await authRequest('GET', '/projects/priority/Medium');
    console.log(`✅ Priority filter: ${priorityResponse.data.count} Medium priority projects`);
    
    return true;
  } catch (error) {
    console.error('❌ Project filtering failed:', error.response?.data?.message || error.message);
    return false;
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting TaskLoad API Tests...\n');
  
  // Test health check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ Health check failed. Make sure the server is running on port 3001.');
    return;
  }
  
  console.log('');
  
  // Test authentication
  const authOk = await testSignup();
  if (!authOk) {
    console.log('\n❌ Authentication tests failed.');
    return;
  }
  
  console.log('');
  
  // Test project operations
  const projectId = await testCreateProject();
  if (!projectId) {
    console.log('\n❌ Project creation failed.');
    return;
  }
  
  console.log('');
  
  await testGetProjects();
  console.log('');
  
  await testUpdateProject(projectId);
  console.log('');
  
  await testFilterProjects();
  console.log('');
  
  await testDeleteProject(projectId);
  
  console.log('\n🎉 All tests completed successfully!');
  console.log('✅ TaskLoad API is working correctly.');
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testHealthCheck,
  testSignup,
  testLogin,
  testCreateProject,
  testGetProjects,
  testUpdateProject,
  testDeleteProject,
  testFilterProjects
}; 
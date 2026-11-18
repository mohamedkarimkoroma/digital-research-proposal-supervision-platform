// client/src/api.js
export const API_URL = 'http://localhost:5000/api';

// Helper to get the logged-in user's token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Helper to get the logged-in user's data
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Helper to log out
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
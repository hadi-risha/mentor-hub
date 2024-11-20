
import axios from 'axios';
import config from '../../config';

const axiosInstance = axios.create({
  baseURL: config.backendUrl, // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve token from localStorage
    const isAdminPath = config.url?.startsWith('/admin');
    
    const token = isAdminPath
    ? localStorage.getItem('adminToken') // Use adminToken for admin routes
    : localStorage.getItem('userToken');
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized access
      const isAdminPath = window.location.pathname.startsWith('/admin');
      if (isAdminPath) {
        localStorage.removeItem('adminToken'); // Remove admin token
        window.location.href = '/admin/login'; // Redirect to admin login
      } else {
        localStorage.removeItem('userToken'); // Remove user token
        window.location.href = '/login'; // Redirect to user login
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

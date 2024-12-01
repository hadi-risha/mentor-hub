
import axios from 'axios';
import config from '../../config';

const axiosInstance = axios.create({
  baseURL: config.backendUrl, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    const isAdminPath = config.url?.startsWith('/admin');
    
    const token = isAdminPath
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;    // Attach token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized access
      const isAdminPath = window.location.pathname.startsWith('/admin');
      if (isAdminPath) {
        localStorage.removeItem('adminToken'); 
        window.location.href = '/admin/login'; 
      } else {
        localStorage.removeItem('userToken'); 
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

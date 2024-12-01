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
  (request) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`; // Attach token to headers
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,




  // (error) => {
  //   return Promise.reject(
  //     error.response ? error.response : { data: { message: "An unknown error occurred. from axios instance" } }
  //   );
  // }

  (error) => {
    // Check if the response indicates the user is blocked
    if (error.response && error.response.data ) {
      
      if (error.response.data.isBlocked) {
        console.warn("User account is blocked. Logging out.");
        localStorage.clear(); // Clear all local storage items
        window.location.reload(); // Redirect to login
        return Promise.reject(error.response);
      }

      // Handle role change logout
      if (error.response.data.isRoleChanged) {
        console.warn("User role changed. Logging out.");
        localStorage.clear(); // Clear all local storage items
        window.location.reload(); // Redirect to login
        return Promise.reject(error.response);
      }
    }

    // Reject the promise for other errors
    return Promise.reject(
        error.response ? error.response : { data: { message: "An unknown error occurred. from axios instance" } }
    );
  }



);

export default axiosInstance;

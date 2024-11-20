import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store"; // Assuming you are using typed selectors from Redux

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const token = useAppSelector((state) => state.login.token || localStorage.getItem('token'));    // Get token from Redux
  const userToken = useAppSelector(
    (state) => state.login?.token || state.otp.token  || localStorage.getItem('token')  // Get token from Redux
  );
  
  const adminToken = localStorage.getItem('adminToken'); // Check for admin token from localStorage
  const location = useLocation();
  
  const isAdminRoute = location.pathname.startsWith('/admin'); // Check if current route is an admin route

  console.log("in protectedroutes............");
  

  if (isAdminRoute) {
    return adminToken ? children : <Navigate to="/admin/login" replace />;
  } else {
    return userToken ? children : <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

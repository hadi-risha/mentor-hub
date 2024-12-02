import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/store"; 

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const token = useAppSelector((state) => state.login.token || localStorage.getItem('token'));    // Get token from Redux
  const userToken = useAppSelector(
    (state) => state.login?.token || state.otp.token  || localStorage.getItem('token')  // Get token from Redux
  );
  const isBlocked = useAppSelector(
    (state) => localStorage.getItem('isBlocked') === "true" || state.login?.isBlocked // Get isBlocked from Redux
  ); 

  console.log("userToken, from protected routes  ", userToken);
  console.log("is user blocked, from protected routes  ", isBlocked);
  


  
  const adminToken = localStorage.getItem('adminToken'); // Check for admin token from localStorage
  const location = useLocation();
  
  const isAdminRoute = location.pathname.startsWith('/admin'); // Check if current route is an admin route

  console.log("adminToken in protectedroutes............", adminToken);
  

  if (isAdminRoute) {
    return adminToken ? children : <Navigate to="/admin/login" replace />;
  } else {
    return userToken && (!isBlocked) ?  children : <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

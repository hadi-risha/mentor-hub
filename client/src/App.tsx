// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './redux/store';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';
import AuthRoutes from './routes/AuthRoutes';
import { useEffect } from "react";
import { setUserRole } from './slices/userRoleSlice';

function App() {

  const userRole = useAppSelector((state) => state.userRole.role);
  const dispatch = useAppDispatch();
  const location = useLocation();

  console.log("user role in App", userRole);

  useEffect(() => {
    if (!userRole) {
      console.log('now role is not set in toolkit, so set set in redux toolkit',userRole);
      const storedRole = localStorage.getItem("userRole");      
      if (storedRole) {
        dispatch(setUserRole(storedRole));
      }
    }
  }, [ userRole, dispatch]);

  // const token = useAppSelector((state) => state.login.token);
  const loginToken = useAppSelector((state) => state.login.token);
  const otpToken = useAppSelector((state) => state.otp.token);
  const token = loginToken || otpToken;
  const adminToken = localStorage.getItem('adminToken')

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';

  if (adminToken && isLoginRoute) {
    return <Navigate to="/admin/dashboard" />;
  }

  if (token && userRole === "user" && isAdminRoute) {
    return <Navigate to="/" />;
  }

  
  return (
    <>
      {isAdminRoute ? <AdminRoutes token={adminToken} /> : token ? <UserRoutes token={token} userRole={userRole} /> : <AuthRoutes />}
    </>
  );
}

export default App;

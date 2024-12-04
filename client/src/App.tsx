// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from './redux/store';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';
import AuthRoutes from './routes/AuthRoutes';

function App() {

  const userRole = localStorage.getItem('userRole');  
  const location = useLocation();

  const loginToken = useAppSelector((state) => state.login.token);
  const otpToken = useAppSelector((state) => state.otp.token);   //token in register case
  const token = loginToken || otpToken;
  
  const adminToken = localStorage.getItem('adminToken');  

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';

  if (adminToken && isLoginRoute) {
    return <Navigate to="/admin/dashboard" />;
  }

  if (token && isAdminRoute) {
    return <Navigate to={`/${userRole}/home`} />;
  }
  return (
    <>
      {isAdminRoute ? <AdminRoutes token={adminToken} /> : token ? <UserRoutes token={token} userRole={userRole} /> : <AuthRoutes />}
    </>
  );
}

export default App;

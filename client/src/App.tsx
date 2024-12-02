// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from './redux/store';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';
import AuthRoutes from './routes/AuthRoutes';

function App() {

  const userRole = localStorage.getItem('userRole');
  console.log("userRole in appppppppppppp", userRole);
  
  const location = useLocation();

  const loginToken = useAppSelector((state) => state.login.token);
  const otpToken = useAppSelector((state) => state.otp.token);   //token in register case
  const token = loginToken || otpToken;

  console.log("loginToken", loginToken);
  console.log("otpToken", otpToken);
  console.log("token................... in app", token);
  
  const adminToken = localStorage.getItem('adminToken');
  console.log("adminToken................... in app", adminToken);
  

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';

  console.log("isAdminRoute................... in app", isAdminRoute);
  console.log("isLoginRoute................... in app", isLoginRoute);
  

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

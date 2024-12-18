import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import AccountTypeManagement from "../pages/admin/AcTypeManagement";
import AdminLogin from "../pages/admin/AdminLogin";
import ProtectedRoute from '../protectedRoute/ProtectedRoute';
import NotificationManagement from "../pages/admin/NotificationManagement";
import CreateNotification from "../pages/admin/CreateNotification";
import UpdateNotification from "../pages/admin/UpdateNotification";
import NewAdminSignup from "../pages/admin/NewAdminSignup";
import NewAdminLogin from "../pages/admin/NewAdminLogin";
import SuperAdminLogin from "../pages/superAdmin/Login";

interface AdminRoutesProps {
  token: string | null;
}

function AdminRoutes({ token }: AdminRoutesProps) {
  const location = useLocation(); 

  if (!token && location.pathname !== "/admin/login") {
    console.log("No token found, redirecting to login...");
    return <Navigate to="/admin/login" replace />;
  }
  const isLoginPage = location.pathname === "/admin/login";

  return (
    <>
      {token && !isLoginPage && (
        <>
          <AdminHeader />
          <div className="flex h-screen">
            <div className="w-80">
              <AdminNavbar />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Routes>
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                <Route path="/admin/account-management" element={<ProtectedRoute><AccountTypeManagement /></ProtectedRoute>} />
                <Route path="/admin/notification-management" element={<ProtectedRoute><NotificationManagement /></ProtectedRoute>} />
                <Route path="/admin/create-notification" element={<ProtectedRoute><CreateNotification /></ProtectedRoute>} />
                <Route path="/admin/update-notification/:notificationId" element={<ProtectedRoute><UpdateNotification /></ProtectedRoute>} />


                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </>
      )}

      {/* Render login page if no token */}
      {!token && (
        <Routes>
          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}   {/* old admin login  */}

          
          {/* <Route path="/admin/login" element={<NewAdminSignup />} />   */}   {/* new admin signup  */}
          {/* <Route path="/admin/login" element={<NewAdminLogin />} />    */}  {/* new admin login  */}
          

          <Route path="/admin/login" element={<SuperAdminLogin />} />  {/* super admin login  */}
        </Routes>
      )}
    </>
  );
}

export default AdminRoutes;




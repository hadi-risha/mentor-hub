import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import AccountTypeManagement from "../pages/admin/AcTypeManagement";
import AdminLogin from "../pages/admin/AdminLogin";
import ProtectedRoute from '../protectedRoute/ProtectedRoute';

interface AdminRoutesProps {
  token: string | null;
}

function AdminRoutes({ token }: AdminRoutesProps) {
  const location = useLocation(); // Get the current location

  // Redirect to login page if no token
  if (!token && location.pathname !== "/admin/login") {
    console.log("No token found, redirecting to login...");
    return <Navigate to="/admin/login" replace />;
  }


  const isLoginPage = location.pathname === "/admin/login";


return (
  <>
    {/* Render layout only if token is present */}
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
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/user-management"
                element={<ProtectedRoute><UserManagement /></ProtectedRoute>}
              />
              <Route
                path="/admin/account-management"
                element={<ProtectedRoute><AccountTypeManagement /></ProtectedRoute>}
              />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </>
    )}

    {/* Render login page if no token */}
    {!token && (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    )}


    
  </>
);
}

export default AdminRoutes;




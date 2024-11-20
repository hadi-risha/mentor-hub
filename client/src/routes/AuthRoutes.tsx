import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/userAuth/Login";
import Register from "../pages/userAuth/Register";
import OtpVerification from "../pages/userAuth/OtpVerification";
import ForgotPassword from "../pages/userAuth/ForgotPassword";
import ResetPassword from "../pages/userAuth/ResetPassword";

function AuthRoutes() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/otp-verification/:email" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AuthRoutes;

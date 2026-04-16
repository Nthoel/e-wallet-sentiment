import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import VerifyEmail from "../pages/public/VerifyEmail";
import ForgotPassword from "../pages/public/ForgotPassword";
import ButtonTest from "../pages/ButtonTest";
import InputTest from "../pages/InputTest";
import Home from "../pages/private/Home";
import Analytics from "../pages/private/Analytics";
import Reviews from "../pages/private/Reviews";
import Settings from "../pages/private/Settings";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../pages/private/DashboardLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Testing Component */}
      <Route path="/button" element={<ButtonTest />} />
      <Route path="/input" element={<InputTest />} />

      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;

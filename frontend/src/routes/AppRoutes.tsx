import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/dashboard/Dashboard";

import Visitors from "../pages/visitors/Visitors";
import CreateVisitor from "../pages/visitors/CreateVisitor";
import VisitorDetails from "../pages/visitors/VisitorDetails";

import Reports from "../pages/reports/Reports";

import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================
          Public Routes
      ========================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =========================
          Dashboard
      ========================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================
          Visitors
      ========================== */}

      <Route
        path="/visitors"
        element={
          <ProtectedRoute>
            <Visitors />
          </ProtectedRoute>
        }
      />

      <Route
        path="/visitors/create"
        element={
          <ProtectedRoute>
            <CreateVisitor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/visitors/edit/:id"
        element={
          <ProtectedRoute>
            <CreateVisitor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/visitors/:id"
        element={
          <ProtectedRoute>
            <VisitorDetails />
          </ProtectedRoute>
        }
      />

      {/* =========================
          Reports
      ========================== */}

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* =========================
          Profile
      ========================== */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* =========================
          Settings
      ========================== */}

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* =========================
          Default Route
      ========================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* =========================
          404
      ========================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
import { Navigate, Route, Routes } from "react-router-dom";

// ==========================================================
// AUTH
// ==========================================================
import Login from "./pages/auth/Login";

// ==========================================================
// DASHBOARD
// ==========================================================
import Dashboard from "./pages/dashboard/Dashboard";

// ==========================================================
// VISITORS
// ==========================================================
import Visitors from "./pages/visitors/Visitors";
import CreateVisitor from "./pages/visitors/CreateVisitor";
import VisitorDetails from "./pages/visitors/VisitorDetails";

// ==========================================================
// PROFILE
// ==========================================================
import Profile from "./pages/profile/Profile";

// ==========================================================
// SCANNER
// ==========================================================
import QRScanner from "./pages/scanner/QRScanner";

// ==========================================================
// REPORTS
// ==========================================================
import Reports from "./pages/reports/Reports";

// ==========================================================
// PROTECTED ROUTE
// ==========================================================
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ======================================================
          PUBLIC ROUTES
      ======================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* ======================================================
          PROTECTED ROUTES
      ======================================================= */}

      <Route element={<ProtectedRoute />}>
        {/* ====================================================
            ROOT
        ===================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* ====================================================
            DASHBOARD
        ===================================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* ====================================================
            VISITORS
        ===================================================== */}

        <Route
          path="/visitors"
          element={<Visitors />}
        />

        {/* ====================================================
            CREATE VISITOR
        ===================================================== */}

        <Route
          path="/visitors/create"
          element={<CreateVisitor />}
        />

        {/* ====================================================
            EDIT VISITOR
        ===================================================== */}

        <Route
          path="/visitors/edit/:id"
          element={<CreateVisitor />}
        />

        {/* ====================================================
            VISITOR DETAILS
        ===================================================== */}

        <Route
          path="/visitors/:id"
          element={<VisitorDetails />}
        />

        {/* ====================================================
            QR SCANNER
        ===================================================== */}

        <Route
          path="/scanner"
          element={<QRScanner />}
        />

        {/* ====================================================
            REPORTS
        ===================================================== */}

        <Route
          path="/reports"
          element={<Reports />}
        />

        {/* ====================================================
            PROFILE
        ===================================================== */}

        <Route
          path="/profile"
          element={<Profile />}
        />
      </Route>

      {/* ======================================================
          404 / UNKNOWN ROUTE
      ======================================================= */}

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
}

export default App;
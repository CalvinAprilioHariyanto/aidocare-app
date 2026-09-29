import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HealthProfilePage } from './pages/HealthProfilePage';
import { RegisterHealthProfilePage } from './pages/RegisterHealthProfilePage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';


function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/register-health-profile"
        element={
          <ProtectedRoute allowedRole="patient">
            <RegisterHealthProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRole="patient">
            <HealthProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
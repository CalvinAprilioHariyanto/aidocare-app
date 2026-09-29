import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HealthProfilePage } from './pages/HealthProfilePage';
import { RegisterHealthProfilePage } from './pages/RegisterHealthProfilePage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { DoctorSchedulePage } from './pages/DoctorSchedulePage';
import { DoctorPatientsPage } from './pages/DoctorPatientsPage';
import { DoctorRecordsPage } from './pages/DoctorRecordsPage';
import { DoctorAnalyticsPage } from './pages/DoctorAnalyticsPage';
import { DoctorNotificationsPage } from './pages/DoctorNotificationsPage';
import { DoctorSettingsPage } from './pages/DoctorSettingsPage';
import { DoctorPortalLayout } from './components/layout/DoctorPortalLayout';


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
            <DoctorPortalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboardPage />} />
        <Route path="schedule" element={<DoctorSchedulePage />} />
        <Route path="patients" element={<DoctorPatientsPage />} />
        <Route path="records" element={<DoctorRecordsPage />} />
        <Route path="analytics" element={<DoctorAnalyticsPage />} />
        <Route path="notifications" element={<DoctorNotificationsPage />} />
        <Route path="settings" element={<DoctorSettingsPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
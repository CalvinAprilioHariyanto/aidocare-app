import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function PatientDashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Patient Dashboard — Coming Soon</h1>
        <p className="text-text-secondary mb-6">Welcome, {user?.firstName}.</p>
        <button onClick={logout} className="text-sm text-primary hover:underline">Logout</button>
      </div>
    </div>
  );
}

function DoctorDashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Doctor Dashboard — Coming Soon</h1>
        <p className="text-text-secondary mb-6">Welcome, Dr. {user?.lastName}.</p>
        <button onClick={logout} className="text-sm text-primary hover:underline">Logout</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
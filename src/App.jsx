import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Temporary placeholder pages — will be replaced by the next developer
function LoginPlaceholder() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Login Page</h1>
        <p className="text-text-secondary">To be implemented by the next developer.</p>
        <p className="text-sm text-text-muted mt-4">
          Use <code className="bg-surface-muted px-2 py-1 rounded text-primary">{'useAuth()'}</code> and the reusable auth components.
        </p>
      </div>
    </div>
  );
}

function RegisterPlaceholder() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Register Page</h1>
        <p className="text-text-secondary">To be implemented by the next developer.</p>
      </div>
    </div>
  );
}

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
      <Route path="/login" element={<LoginPlaceholder />} />
      <Route path="/register" element={<RegisterPlaceholder />} />

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
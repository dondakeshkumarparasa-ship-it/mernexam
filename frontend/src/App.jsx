import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PracticeProvider } from './context/PracticeContext';
import Practice from './pages/Practice';
import Bookmarks from './pages/Bookmarks';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Protected Administrative Route Wrapper
const AdminRoute = ({ children }) => {
  const { isAdminAuthenticated } = useAuth();
  return isAdminAuthenticated() ? children : <Navigate to="/admin" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <PracticeProvider>
          <Routes>
            {/* Student SPA Portal Routes */}
            <Route path="/" element={<Practice />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Locked Administrative Console Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />

            {/* Safe Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PracticeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

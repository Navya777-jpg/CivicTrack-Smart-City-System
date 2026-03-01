import React, { ReactNode } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CitizenDashboard from './pages/CitizenDashboard';
import ReportIssue from './pages/ReportIssue';
import IssueList from './pages/IssueList';
import Notifications from './pages/Notifications';

import ProjectInfo from './pages/ProjectInfo';

function PrivateRoute({ children, role }: { children: ReactNode, role?: 'admin' | 'citizen' }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/citizen'} replace />;

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/issues" element={
            <PrivateRoute role="admin">
              <IssueList />
            </PrivateRoute>
          } />
          <Route path="/admin/analytics" element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          } />

          {/* Citizen Routes */}
          <Route path="/citizen" element={
            <PrivateRoute role="citizen">
              <CitizenDashboard />
            </PrivateRoute>
          } />
          <Route path="/citizen/report" element={
            <PrivateRoute role="citizen">
              <ReportIssue />
            </PrivateRoute>
          } />
          <Route path="/citizen/issues" element={
            <PrivateRoute role="citizen">
              <IssueList />
            </PrivateRoute>
          } />

          {/* Common Private Routes */}
          <Route path="/notifications" element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          } />

          <Route path="/about" element={
            <PrivateRoute>
              <ProjectInfo />
            </PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

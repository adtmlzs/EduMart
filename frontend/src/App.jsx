import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Mart from './pages/Mart';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import NotesVault from './pages/NotesVault';
import Confessions from './pages/Confessions';
import Polls from './pages/Polls';
import Inbox from './pages/Inbox';
import SchoolDashboard from './pages/SchoolDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
    );
    return isAuthenticated ? children : <Navigate to="/" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
    );
    return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function AppContent() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                    <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/mart" element={<ProtectedRoute><Mart /></ProtectedRoute>} />
                    <Route path="/clubs" element={<ProtectedRoute><Clubs /></ProtectedRoute>} />
                    <Route path="/clubs/:id" element={<ProtectedRoute><ClubDetail /></ProtectedRoute>} />
                    <Route path="/notes" element={<ProtectedRoute><NotesVault /></ProtectedRoute>} />
                    <Route path="/confessions" element={<ProtectedRoute><Confessions /></ProtectedRoute>} />
                    <Route path="/polls" element={<ProtectedRoute><Polls /></ProtectedRoute>} />
                    <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><SchoolDashboard /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;

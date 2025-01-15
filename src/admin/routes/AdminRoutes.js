import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import BlogPosts from '../pages/BlogPosts';
import Profile from '../pages/Profile';
import AdminLayout from '../components/AdminLayout';
import Login from '../pages/Login';
import Setup from '../pages/Setup';
import Users from '../pages/Users';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }
    
    return <AdminLayout>{children}</AdminLayout>;
};

export default function AdminRoutes() {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="setup" element={<Setup />} />
            
            {/* Protected routes */}
            <Route
                path="dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="events"
                element={
                    <ProtectedRoute>
                        <Events />
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="blog-posts"
                element={
                    <ProtectedRoute>
                        <BlogPosts />
                    </ProtectedRoute>
                }
            />

            <Route
                path="users"
                element={
                    <ProtectedRoute>
                        <Users />
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            
            {/* Redirect /admin to /admin/dashboard */}
            <Route
                path=""
                element={<Navigate to="dashboard" replace />}
            />
        </Routes>
    );
} 
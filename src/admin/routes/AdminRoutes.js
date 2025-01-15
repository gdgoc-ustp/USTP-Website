import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Login from '../pages/Login';
import Setup from '../pages/Setup';
import AdminLayout from '../components/AdminLayout';

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

// Placeholder components for admin pages
const Dashboard = () => <div>Dashboard Content</div>;
const Events = () => <div>Events Management</div>;
const BlogPosts = () => <div>Blog Posts Management</div>;
const Profile = () => <div>User Profile</div>;

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
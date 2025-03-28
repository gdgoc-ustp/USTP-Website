import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import BlogPosts from './pages/BlogPosts';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Setup from './pages/Setup';
import Login from './pages/Login';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="setup" element={<Setup />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="events" element={<Events />} />
            <Route path="blog-posts" element={<BlogPosts />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<Profile />} />
            {/* Redirect /admin to /admin/dashboard */}
            <Route path="" element={<Navigate to="dashboard" replace />} />
        </Routes>
    );
};

export default AdminRoutes; 
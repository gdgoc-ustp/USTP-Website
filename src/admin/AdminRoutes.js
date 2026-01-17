import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/setup" element={<Setup />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/events" element={<Events />} />
            <Route path="/admin/blog-posts" element={<BlogPosts />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/profile" element={<Profile />} />
        </Routes>
    );
};

export default AdminRoutes; 
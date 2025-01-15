import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import BlogPosts from './pages/BlogPosts';

export default function AdminRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/blog-posts" element={<BlogPosts />} />
        </Routes>
    );
} 
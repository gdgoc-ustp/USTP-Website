import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';
import logo from '../../assets/logo.png';
export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut, user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu when navigating
    const handleNavigation = (to) => {
        setIsMobileMenuOpen(false);
        navigate(to);
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/admin/login');
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    // Get the current page title from the path
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <div className={`admin-layout ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div
                className={`admin-sidebar-overlay ${isMobileMenuOpen ? 'show' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <nav className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <img src={logo} alt="Logo" className="admin-logo" />
                </div>

                <div className="admin-sidebar-menu">
                    <Link
                        to="/admin/dashboard"
                        className={`admin-menu-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/events"
                        className={`admin-menu-item ${location.pathname === '/admin/events' ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Events
                    </Link>
                    <Link
                        to="/admin/blog-posts"
                        className={`admin-menu-item ${location.pathname === '/admin/blog-posts' ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Blog Posts
                    </Link>
                    <Link
                        to="/admin/profile"
                        className={`admin-menu-item ${location.pathname === '/admin/profile' ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Profile
                    </Link>
                </div>

                <div className="admin-sidebar-footer">
                    <button onClick={handleLogout} className="admin-logout-button">
                        Logout
                    </button>
                </div>
            </nav>

            <main className="admin-content">
                <header className="admin-header">
                    <div className="admin-header-left">
                        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                        </button>
                        <div className="admin-header-title">
                            {getPageTitle()}
                        </div>
                    </div>
                    <div className="admin-header-actions">
                        <div className="admin-user-profile">
                            <span className="user-email-desktop">{user?.email}</span>
                            <div className="user-avatar-mobile">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-main-content">
                    {children}
                </div>
            </main>
        </div>
    );
} 
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';
import logo from '../../assets/logo.png';
export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut, user } = useAuth();
    
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
        <div className="admin-layout">
            <nav className="admin-sidebar">
                <div className="admin-sidebar-header">
                    {/* <h2>Admin Panel</h2> */}
                    <img src={logo} alt="Logo" />
                </div>
                
                <div className="admin-sidebar-menu">
                    <Link 
                        to="/admin/dashboard" 
                        className={`admin-menu-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                    >
                        Dashboard
                    </Link>
                    <Link 
                        to="/admin/events" 
                        className={`admin-menu-item ${location.pathname === '/admin/events' ? 'active' : ''}`}
                    >
                        Events
                    </Link>
                    <Link 
                        to="/admin/blog-posts" 
                        className={`admin-menu-item ${location.pathname === '/admin/blog-posts' ? 'active' : ''}`}
                    >
                        Blog Posts
                    </Link>
                    <Link 
                        to="/admin/profile" 
                        className={`admin-menu-item ${location.pathname === '/admin/profile' ? 'active' : ''}`}
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
                    <div className="admin-header-title">
                        {getPageTitle()}
                    </div>
                    <div className="admin-header-actions">
                        <div className="admin-user-profile">
                            <span>{user?.email}</span>
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
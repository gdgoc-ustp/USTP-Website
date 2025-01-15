import { useState, useEffect } from 'react'
import './navBar.css'
import { NavLink } from 'react-router-dom'
import Logo from '../assets/logo.svg'

export default function NavigationBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    }
    
    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('menu-open');
    }
    
    // Close menu when window is resized to desktop size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
        }
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [isMenuOpen]);

    return (
        <>
            <div className="navbar-container">
                <div className="navbar-content">
                    <NavLink to="/">
                        <img src={Logo} className="navbar-logo" alt="GDSC Logo" />
                    </NavLink>
                    
                    <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    
                    <nav className={`navbar-links ${isMenuOpen ? 'mobile-menu-active' : ''}`}>
                        <NavLink
                            to="/"
                            className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                            onClick={closeMenu}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/news"
                            className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                            onClick={closeMenu}
                        >
                            News
                        </NavLink>
                        <NavLink
                            to="/events"
                            className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                            onClick={closeMenu}
                        >
                            Events
                        </NavLink>
                        <NavLink
                            to="/aboutus"
                            className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                            onClick={closeMenu}
                        >
                            About Us
                        </NavLink>
                        <button className="register-button mobile-register" onClick={closeMenu}>
                            Register Now
                        </button>
                    </nav>
                    
                    <button className="register-button desktop-register">
                        Register Now
                    </button>
                </div>
            </div>
            
            {/* Overlay for mobile menu */}
            <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
        </>
    );
}

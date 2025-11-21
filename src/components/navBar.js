import { useState, useEffect } from 'react'
import './navBar.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.svg'

export default function NavigationBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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

    const handleNavClick = (to) => (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMenu();
        // Navigate with state containing the current path
        navigate(to, { state: { from: location.pathname } });
    }

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
                        <img src={Logo} className="navbar-logo" alt="GDG Logo" />
                    </NavLink>

                    <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <nav className={`navbar-links ${isMenuOpen ? 'mobile-menu-active' : ''}`}>
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            onClick={handleNavClick('/')}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/news"
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            onClick={handleNavClick('/news')}
                        >
                            News
                        </NavLink>
                        <NavLink
                            to="/events"
                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            onClick={handleNavClick('/events')}
                        >
                            Events
                        </NavLink>
                        <div className="nav-dropdown">
                            <NavLink
                                to="/about-us"
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                onClick={handleNavClick('/about-us')}
                            >
                                About Us
                            </NavLink>
                            <div className="dropdown-menu">
                                <NavLink
                                    to="/team"
                                    className="dropdown-link"
                                    onClick={handleNavClick('/team')}
                                >
                                    Meet the Team
                                </NavLink>
                            </div>
                        </div>
                        <button className="register-button mobile-register" onClick={closeMenu}>
                            Register Now
                        </button>
                    </nav>

                    <button className="register-button desktop-register">
                        Register Now
                    </button>
                </div>
            </div>

            <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
        </>
    );
}

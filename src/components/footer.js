import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './footer.css';
import Logo from '../assets/logo.png';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub, FaDiscord } from 'react-icons/fa';

export default function Footer() {
  const location = useLocation();

  const handleLinkClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand-section">
            <img src={Logo} className="footer-brand-logo" alt="GDG Logo" />
            <div className="footer-brand-text">
              <h2 className="footer-brand-title">Google Developer Groups</h2>
              <p className="footer-brand-subtitle">On Campus • USTP</p>
            </div>
            <p className="footer-mission-statement">
              Connecting students, developers, and tech enthusiasts to learn, share, and grow together.
            </p>
          </div>

          <div className="footer-nav-section">
            <div className="footer-nav-column">
              <h4 className="footer-nav-title">Community</h4>
              <ul className="footer-nav-list">
                <li><a href="https://gdg.community.dev/" target="_blank" rel="noopener noreferrer" className="footer-nav-link">Join Chapter</a></li>
                <li><Link to="/about-us" className="footer-nav-link">About Us</Link></li>
                <li><Link to="/events" className="footer-nav-link">Events</Link></li>
                <li><Link to="/news" className="footer-nav-link">News</Link></li>
              </ul>
            </div>

            <div className="footer-nav-column">
              <h4 className="footer-nav-title">Resources</h4>
              <ul className="footer-nav-list">
                <li><a href="https://developers.google.com/" target="_blank" rel="noopener noreferrer" className="footer-nav-link">Google Developers</a></li>
                <li><a href="https://devlibrary.withgoogle.com/" target="_blank" rel="noopener noreferrer" className="footer-nav-link">Dev Library</a></li>
                <li><Link to="/faqs" className="footer-nav-link">FAQ</Link></li>
              </ul>
            </div>

            <div className="footer-nav-column">
              <h4 className="footer-nav-title">Connect</h4>
              <ul className="footer-nav-list">
                <li><a href="mailto:contact@gdgustp.com" className="footer-nav-link">Contact Us</a></li>
                <li><a href="https://discord.gg/CgTHNhpW" target="_blank" rel="noopener noreferrer" className="footer-nav-link">Discord Server</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} GDG on Campus USTP. All Rights Reserved.
          </div>

          <div className="footer-socials">
            <a href="https://www.facebook.com/dscustp" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://github.com/USTP-GDSC" target="_blank" rel="noopener noreferrer" aria-label="Github"><FaGithub /></a>
            <a href="https://discord.gg/CgTHNhpW" target="_blank" rel="noopener noreferrer" aria-label="Discord"><FaDiscord /></a>
            <a href="https://www.instagram.com/gdgocustp/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.linkedin.com/company/gdgocustp/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>

          <div className="footer-legal">
            <Link to="/policy" className="footer-legal-link" onClick={(e) => handleLinkClick(e, '/policy')}>Privacy Policy</Link>
            <Link to="/terms" className="footer-legal-link" onClick={(e) => handleLinkClick(e, '/terms')}>Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

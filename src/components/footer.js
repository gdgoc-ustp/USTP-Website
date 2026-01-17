import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './footer.css';
import Logo from '../assets/logo.svg';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const location = useLocation();

  const handleLinkClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo-container">
          <img src={Logo} className="footer-logo" alt="GDG Logo" />
          <div className="footer-logo-text">
            <div className="footer-title">
              Google Developer Groups on Campus
            </div>
            <div className="footer-subtitle">
              University of Science and Technology of Southern Philippines
            </div>
          </div>
        </div>

        <div className="footer-links-container">
          <div className="footer-links-column">
            <h3 className="footer-column-title">Everything</h3>
            <Link to="/" className="footer-link">Lorem ipsum dolor sit</Link>
            <Link to="/" className="footer-link">Lorem ipsum dolor sit</Link>
          </div>

          <div className="footer-links-column">
            <h3 className="footer-column-title">Everything</h3>
            <Link to="/" className="footer-link">Lorem ipsum dolor sit</Link>
            <Link to="/" className="footer-link">Lorem ipsum dolor sit</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright-container">
          <div className="footer-copyright">
            (C) GDG-USTP All Rights Reserved
          </div>
          <div className="footer-policy-links">
            <div className="footer-dot" />
            <Link to="/policy" className="footer-policy-link" onClick={(e) => handleLinkClick(e, '/policy')}>
              Privacy & Policy
            </Link>
            <div className="footer-dot" />
            <Link to="/terms" className="footer-policy-link" onClick={(e) => handleLinkClick(e, '/terms')}>
              Terms of Use
            </Link>
            <div className="footer-dot" />
            <Link to="/sitemap" className="footer-policy-link" onClick={(e) => handleLinkClick(e, '/sitemap')}>
              Sitemap
            </Link>
          </div>
        </div>

        <div className="footer-social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <FaFacebook size={24} color="#000" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <FaTwitter size={24} color="#000" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <FaInstagram size={24} color="#000" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <FaLinkedin size={24} color="#000" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <FaYoutube size={24} color="#000" />
          </a>
        </div>
      </div>
    </footer>
  );
}

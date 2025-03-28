import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import Logo from '../assets/vector.svg'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-logo-container">
                    <img
                        src={Logo}
                        className="footer-logo"
                        alt="GDSC Logo"
                        style={{ width: "100%", maxWidth: "200px", height: "auto" }}
                    />
                </div>
                <div className="footer-links-container">
                    <div className="footer-links-column">
                        <h3 className="footer-column-title">
                            Everything
                        </h3>
                        <Link to="/" className="footer-link">
                            Lorem ipsum dolor sit
                        </Link>
                        <Link to="/" className="footer-link">
                            Lorem ipsum dolor sit
                        </Link>
         
                    </div>
                    <div className="footer-links-column">
                        <h3 className="footer-column-title">
                            Everything
                        </h3>
                        <Link to="/" className="footer-link">
                            Lorem ipsum dolor sit
                        </Link>
                        <Link to="/" className="footer-link">
                            Lorem ipsum dolor sit
                        </Link>

                    </div>
                   
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-copyright-container">
                    <div className="footer-copyright">
                        (C) GDSC-USTP All Rights Reserved
                    </div>
                    <div className="footer-policy-links">
                        <div className="footer-dot" />
                        <Link to="/privacy" className="footer-policy-link">
                            Privacy Policy
                        </Link>
                        <div className="footer-dot" />
                        <Link to="/terms" className="footer-policy-link">
                            Terms of Use
                        </Link>
                        <div className="footer-dot" />
                        <Link to="/sitemap" className="footer-policy-link">
                            Sitemap
                        </Link>
                    </div>
                </div>
                <div className="footer-social-links">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social-link"
                        aria-label="Facebook"
                    >
                        <span className="sr-only">Facebook</span>
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social-link"
                        aria-label="Twitter"
                    >
                        <span className="sr-only">Twitter</span>
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social-link"
                        aria-label="Instagram"
                    >
                        <span className="sr-only">Instagram</span>
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social-link"
                        aria-label="LinkedIn"
                    >
                        <span className="sr-only">LinkedIn</span>
                    </a>
                    <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social-link"
                        aria-label="YouTube"
                    >
                        <span className="sr-only">YouTube</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}

import React from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from '../components/navBar';
import Footer from '../components/footer';
import './sitemap.css';

export default function Sitemap() {
    const sitemapData = [
        {
            category: 'Main Pages',
            links: [
                { name: 'Home', url: '/', description: 'Welcome to GDG USTP - Building good things together' },
                { name: 'About Us', url: '/about-us', description: 'Learn about our mission, vision, and history' },
                { name: 'Meet the Team', url: '/team', description: 'Get to know our amazing team members' },
                { name: 'News', url: '/news', description: 'Latest updates and announcements from our community' },
                { name: 'Events', url: '/events', description: 'Upcoming workshops, talks, and community gatherings' },
                { name: 'FAQs', url: '/faqs', description: 'Frequently asked questions about GDG USTP' }
            ]
        },
        {
            category: 'Tools & Features',
            links: [
                { name: 'Personality Test', url: '/personality-test', description: 'Take our interactive personality assessment' },
                { name: 'Personality Code Input', url: '/personality-test/code', description: 'Enter your personality code for results' }
            ]
        },
        {
            category: 'Legal & Support',
            links: [
                { name: 'Privacy Policy', url: '/policy', description: 'Our commitment to protecting your privacy' },
                { name: 'Terms of Service', url: '/terms', description: 'Terms and conditions for using our website' }
            ]
        }
    ];

    // Get current date for last modified
    const lastModified = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <>
            <title>Sitemap - GDG USTP | Site Navigation</title>
            <meta name="description" content="Complete sitemap of GDG USTP website. Find all pages, tools, and resources in one organized location." />
            <meta name="keywords" content="sitemap, navigation, GDG USTP, site map, website structure" />
            <meta name="robots" content="index, follow" />
            
            <NavigationBar />
            
            <div className="sitemap-page">
                <div className="sitemap-container">
                    <header className="sitemap-header">
                        <h1 className="sitemap-title">GDG-USTP Sitemap</h1>
                        <p className="sitemap-description">
                            Sitemap to all pages and resources on the GDG USTP website. 
                            Find everything you need quickly and easily.
                        </p>
                        <div className="sitemap-meta">
                            <p className="last-updated">Last updated: {lastModified}</p>
                            <p className="total-pages">Total pages: {sitemapData.reduce((total, category) => total + category.links.length, 0)}</p>
                        </div>
                    </header>

                    <div className="sitemap-content">
                        {sitemapData.map((category, index) => (
                            <section key={index} className="sitemap-section">
                                <h2 className="category-title">{category.category}</h2>
                                <div className="links-grid">
                                    {category.links.map((link, linkIndex) => (
                                        <div key={linkIndex} className="sitemap-link-card">
                                            <Link to={link.url} className="sitemap-link">
                                                <h3 className="link-name">{link.name}</h3>
                                                <span className="link-url">{window.location.origin}{link.url}</span>
                                            </Link>
                                            <p className="link-description">{link.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    <footer className="sitemap-footer">
                        <div className="sitemap-info">
                            <h3>About This Sitemap</h3>
                            <p>
                                This sitemap provides a comprehensive overview of all publicly accessible pages 
                                on the GDG USTP website. It's designed to help both users and search engines 
                                navigate our site efficiently.
                            </p>
                            <div className="sitemap-actions">
                                <Link to="/sitemap.xml" className="xml-sitemap-link" target="_blank">
                                    View XML Sitemap
                                </Link>
                                <Link to="/" className="back-home-link">
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
            
            <Footer />
        </>
    );
}
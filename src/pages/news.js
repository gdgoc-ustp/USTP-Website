import React, { useEffect, useState, useMemo, useRef } from 'react';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import './news.css';
import './main.css';
import './home.css';
import '../components/HeroSection.css';
import Sample from '../assets/sample.png';
import { Link, useLocation } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';

export default function News() {
    const location = useLocation();

    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const postsPerPage = 10;

    // Window size for responsive circle sizing
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Get the previous path from location state
    const previousPath = location.state?.from || '/';

    // Determine if we're coming from a page with hero section
    const comingFromHeroPage = previousPath.includes('/events') ||
        previousPath.includes('/about') ||
        previousPath.includes('/news');

    const contentRef = useRef(null);

    // Calculate target size for the circle based on window size (matching circle-7)
    const vmin = Math.min(windowSize.width, windowSize.height);
    const targetSize = Math.min(Math.max(240, vmin * 0.9), 1100);

    // Define animation variants for the red circle
    const circleVariants = {
        fromEvents: {
            // From circle-8 position (right: 2%, top: 86%)
            left: '98%',
            top: '86%',
            width: `${Math.min(windowSize.width, windowSize.height) * 0.082}px`,
            height: `${Math.min(windowSize.width, windowSize.height) * 0.082}px`,
        },
        fromHero: {
            // Already at center position
            left: '50%',
            top: '50%',
            width: `${targetSize}px`,
            height: `${targetSize}px`,
        },
        fromHome: {
            // From circle2 position (bottom: 10%, left: 14%)
            left: '14%',
            top: '90%',
            width: '300px',
            height: '300px',
        },
        final: {
            // Final center position
            left: '50%',
            top: '50%',
            width: `${targetSize}px`,
            height: `${targetSize}px`,
        }
    };

    // Determine initial variant based on previous page
    const getInitialVariant = () => {
        if (previousPath.includes('/events')) {
            return 'fromEvents';
        } else if (comingFromHeroPage) {
            return 'fromHero';
        } else {
            return 'fromHome';
        }
    };

    // Banner content animation variants
    const bannerContentVariants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        },
        hidden: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    // Hero elements animation variants
    const heroElementsVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    // Banner height management
    const [bannerHeight, setBannerHeight] = useState(
        comingFromHeroPage ? 'clamp(360px, 60svh, 720px)' : '100vh'
    );

    useEffect(() => {
        if (!comingFromHeroPage) {
            // Animate height reduction after component mounts, coordinated with circle animation
            const timer = setTimeout(() => {
                setBannerHeight('clamp(360px, 60svh, 720px)');
            }, 300); // Delay to let circle start moving first
            return () => clearTimeout(timer);
        }
    }, [comingFromHeroPage]);

    useEffect(() => {
        // Window resize handler
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
        });
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async (pageNumber = 0) => {
        try {
            setLoading(true);
            setError(null);

            const offset = pageNumber * postsPerPage;

            const response = await fetch(
                `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/blog_posts?select=*&limit=${postsPerPage}&offset=${offset}&order=created_at.desc`,
                {
                    headers: {
                        "apikey": `${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error fetching blog posts: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.length < postsPerPage) {
                setHasMore(false);
            }

            // If this is the first page, replace the posts array
            // If it's a subsequent page, append to the existing array
            if (pageNumber === 0) {
                setBlogPosts(data);
            } else {
                setBlogPosts((prev) => [...prev, ...data]);
            }
        } catch (err) {
            console.error("Error fetching blog posts:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to create placeholder image if none exists
    const getImageUrl = (url) => {
        if (!url) return Sample;
        if (url.startsWith('http')) return url;
        return `https://yrvykwljzajfkraytbgr.supabase.co/storage/v1/object/public/blog-images/${url}`;
    };

    // Function to format date nicely
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours < 1) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
            }
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            const options = { year: "numeric", month: "long", day: "numeric" };
            return date.toLocaleDateString(undefined, options);
        }
    };

    // Function to strip HTML tags from description for preview
    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    const truncateText = (text, maxLength = 200) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBlogPosts(nextPage);
    };

    // Filter and sort posts based on search term and sort option
    const filteredAndSortedPosts = useMemo(() => {
        let filtered = blogPosts.filter(post =>
            post.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.tagline && post.tagline.toLowerCase().includes(searchTerm.toLowerCase())) ||
            stripHtml(post.description).toLowerCase().includes(searchTerm.toLowerCase())
        );

        switch (sortBy) {
            case 'oldest':
                return filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            case 'alphabetical':
                return filtered.sort((a, b) => a.heading.localeCompare(b.heading));
            default: // newest
                return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
    }, [blogPosts, searchTerm, sortBy]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <>
            <title>News</title>
            <NavigationBar />
            <main>
                {/* Hero Section with Transition */}
                <header className="banner" style={{ 
                    height: bannerHeight, 
                    transition: comingFromHeroPage ? 'none' : 'height 0.8s ease-in-out' 
                }}>

                    {/* Conditional Banner Circles - Only show initial circles when coming from non-hero pages */}
                    {!comingFromHeroPage && (
                        <motion.div 
                            variants={bannerContentVariants}
                            initial="visible"
                            animate="hidden"
                            style={{ position: 'absolute', inset: 0, zIndex: 0 }}
                        >
                            <div className="circle circle1"></div>
                            <div className="circle circle3"></div>
                            <div className="circle circle4"></div>

                            {/* Gray accent circles */}
                            <div className="gray-circle gray-circle1"></div>
                            <div className="gray-circle gray-circle2"></div>
                            <div className="gray-circle gray-circle3"></div>
                        </motion.div>
                    )}

                    {/* Hero Circles - Always present for news page */}
                    <motion.div 
                        className="hero-circles" 
                        variants={heroElementsVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
                    >
                        <div className="circle circle-1"></div>
                        <div className="circle circle-2"></div>
                        <div className="circle circle-3"></div>
                        <div className="circle circle-4"></div>
                        <div className="circle circle-5"></div>
                        <div className="circle circle-6"></div>
                        {/* circle-8 (green circle) */}
                        <div
                            className="circle circle-8"
                            style={{
                                background: 'linear-gradient(135deg, #4EA865 0%, #1C793A 100%)'
                            }}
                        ></div>
                    </motion.div>

                    {/* Red Circle (circle-7 - Main transitioning circle) */}
                    <motion.div 
                        variants={circleVariants}
                        initial={getInitialVariant()}
                        animate="final"
                        transition={{ 
                            duration: 1.2, 
                            ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth motion
                            type: "tween" 
                        }}
                        style={{
                            position: 'absolute',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #EB483B 0%, #B41F19 100%)',
                            zIndex: 2,
                            transform: 'translate(-50%, -50%)' // Center the circle on its position
                        }}
                    ></motion.div>

                    {/* New Hero Title "News" */}
                    <motion.div 
                        variants={heroElementsVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ position: 'absolute', zIndex: 10 }}
                    >
                        <h1 style={{ color: 'white', fontSize: '5rem', fontWeight: '700', margin: 0 }}>News</h1>
                    </motion.div>
                </header>

                <section className="news-container" ref={contentRef}>
                    <div className="whats-new-section">
                        <h2>What's New</h2>

                        {/* Search and Filter Controls */}
                        <div className="news-controls">
                            <div className="news-search-container">
                                <div className="news-search-input-wrapper">
                                    <svg className="news-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search articles..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="news-search-input"
                                    />
                                    {searchTerm && (
                                        <button onClick={clearSearch} className="news-clear-search" aria-label="Clear search">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="news-sort-container">
                                <select value={sortBy} onChange={handleSortChange} className="news-sort-select">
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="alphabetical">A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Results Summary */}
                        {searchTerm && (
                            <div className="news-search-results-summary">
                                <p>
                                    {filteredAndSortedPosts.length} result{filteredAndSortedPosts.length !== 1 ? 's' : ''}
                                    {searchTerm && ` for "${searchTerm}"`}
                                </p>
                            </div>
                        )}

                        <div className="blog-posts">
                            {filteredAndSortedPosts.length > 0 ? (
                                filteredAndSortedPosts.map((post, index) => (
                                    <div key={post.id} className="blog-post" data-aos="fade-up" data-aos-delay={index * 100}>
                                        <div className="post-image">
                                            <img
                                                src={getImageUrl(post.image_url)}
                                                alt={post.heading}
                                            />
                                        </div>
                                        <div className="post-content">
                                            <div className="post-header">
                                                <h3>{post.heading}</h3>
                                                <p className="post-date">{formatDate(post.created_at)}</p>
                                            </div>
                                            <p className="post-description">
                                                {post.tagline || truncateText(stripHtml(post.description), 300)}
                                            </p>
                                            <Link to={`/news/article/${post.id}`} className="read-button">
                                                Read
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : !loading && !error ? (
                                <div className="no-posts">
                                    <p>
                                        {searchTerm
                                            ? `No articles found matching "${searchTerm}". Try adjusting your search terms.`
                                            : "No blog posts found. Check back soon for updates!"
                                        }
                                    </p>
                                    {searchTerm && (
                                        <button onClick={clearSearch} className="news-clear-search-button">
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            ) : null}

                            {loading && (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading posts...</p>
                                </div>
                            )}

                            {error && (
                                <div className="error-container">
                                    <div className="error-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                    </div>
                                    <h3>Oops! Something went wrong</h3>
                                    <p>We couldn't load the articles. Please check your connection and try again.</p>
                                    <button onClick={fetchBlogPosts} className="retry-button">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 4v6h6M23 20v-6h-6" />
                                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                                        </svg>
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </div>

                        {hasMore && blogPosts.length > 0 && !loading && !searchTerm && (
                            <div className="load-more-container">
                                <button
                                    onClick={loadMore}
                                    className="load-more-button"
                                    disabled={loading}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 5v14M5 12l7 7 7-7" />
                                    </svg>
                                    Load More Articles
                                </button>
                                <p className="posts-count">
                                    Showing {blogPosts.length} articles
                                </p>
                            </div>
                        )}

                        {/* Pagination info when searching */}
                        {searchTerm && filteredAndSortedPosts.length > 0 && (
                            <div className="pagination-info">
                                <p>
                                    Showing {filteredAndSortedPosts.length} of {blogPosts.length} articles
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main >
            <Footer />
        </>
    );
}

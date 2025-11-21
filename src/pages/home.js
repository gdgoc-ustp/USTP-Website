import React, { useEffect, useState, useRef } from 'react';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import './home.css';
import './main.css';
import './news.css';
import '../components/HeroSection.css';
import About from '../assets/sample.png';
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSpring, animated, config } from 'react-spring';
import * as Sentry from '@sentry/react';


export default function Home() {
    const [showPageContent, setShowPageContent] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Create a ref for scrolling to content
    const contentRef = useRef(null);

    // Check if mobile on initial load and window resize
    useEffect(() => {
        const checkIsMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            // Show content immediately on mobile
            if (mobile && !showPageContent) {
                setShowPageContent(true);
            }

            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        // Initial check
        checkIsMobile();

        // Add resize listener for mobile device
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, [showPageContent]);

    useEffect(() => {
        AOS.init();
    }, []);

    // Content reveal spring animation
    const contentProps = useSpring({
        opacity: showPageContent ? 1 : 0,
        transform: showPageContent ? 'translateY(0)' : 'translateY(20px)',
        config: { tension: 280, friction: 60 }
    });

    // Animation for the blue circle (circle1)
    const circleSpring = useSpring({
        to: isHeroVisible ? {
            top: '50%',
            left: '50%',
            width: 'clamp(240px, 90vmin, 1100px)',
            height: 'clamp(240px, 90vmin, 1100px)',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            position: 'absolute'
        } : {
            top: '-5%',
            left: '-5%',
            width: '380px',
            height: '380px',
            // Remove transform here to let CSS animation take over
            // transform: 'translate(0%, 0%)', 
            borderRadius: '50%',
            position: 'absolute'
        },
        config: config.molasses
    });

    // Animation for fading out initial banner content
    const bannerContentSpring = useSpring({
        opacity: isHeroVisible ? 0 : 1,
        transform: isHeroVisible ? 'translateY(-20px)' : 'translateY(0px)',
        pointerEvents: isHeroVisible ? 'none' : 'auto',
        config: config.molasses
    });

    // Animation for fading in new hero title
    const heroTitleSpring = useSpring({
        opacity: isHeroVisible ? 1 : 0,
        transform: isHeroVisible ? 'translateY(0px)' : 'translateY(20px)',
        delay: 200,
        config: config.molasses
    });

    // Animation for new hero circles
    const heroCirclesSpring = useSpring({
        opacity: isHeroVisible ? 1 : 0,
        config: config.molasses
    });

    const handleLearnMore = () => {
        setIsHeroVisible(true);

        // Show the rest of the page content after transition
        setTimeout(() => {
            setShowPageContent(true);
            // Scroll to the content section after a small delay
            if (contentRef.current) {
                contentRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 800);
    };

    return (
        <>
            <NavigationBar />
            <main>
                {/* Hero Section (always visible) */}
                <header className="banner" style={{ height: isHeroVisible ? 'clamp(360px, 60svh, 720px)' : '100vh', transition: 'height 0.8s ease-in-out' }}>

                    {/* Initial Banner Circles - Wrapped to preserve positioning context */}
                    <animated.div style={{ ...bannerContentSpring, position: 'absolute', inset: 0, zIndex: 0 }}>
                        <div className="circle circle2"></div>
                        <div className="circle circle3"></div>
                        <div className="circle circle4"></div>

                        {/* Gray accent circles */}
                        <div className="gray-circle gray-circle1"></div>
                        <div className="gray-circle gray-circle2"></div>
                        <div className="gray-circle gray-circle3"></div>
                    </animated.div>

                    {/* Blue Circle (Transitions between states) */}
                    <animated.div className="circle circle1" style={circleSpring}></animated.div>

                    {/* New Hero Circles (Fade in) */}
                    <animated.div className="hero-circles" style={{ ...heroCirclesSpring, position: 'absolute', inset: 0, zIndex: 0 }}>
                        <div className="circle circle-1"></div>
                        <div className="circle circle-2"></div>
                        <div className="circle circle-3"></div>
                        <div className="circle circle-4"></div>
                        <div className="circle circle-5"></div>
                        <div className="circle circle-6"></div>
                        {/* circle-7 is the blue circle animated above */}
                        <div className="circle circle-8"></div>
                    </animated.div>

                    {/* Banner Content (Text/Button) */}
                    <animated.div style={{ ...bannerContentSpring, zIndex: 2, position: 'relative' }}>
                        <div className="banner-content">
                            <h1 className="banner-title">
                                Building Good Things, <span className="color-text">Together!</span>
                            </h1>
                            <p>
                                Google Developer Groups on Campus - USTP
                            </p>
                            {!isMobile && (
                                <button
                                    className="banner-button"
                                    onClick={handleLearnMore}
                                >
                                    Learn More
                                </button>
                            )}
                        </div>
                    </animated.div>

                    {/* New Hero Title "Home" */}
                    <animated.div style={{ ...heroTitleSpring, position: 'absolute', zIndex: 10 }}>
                        <h1 style={{ color: 'white', fontSize: '5rem', fontWeight: '700', margin: 0 }}>Home</h1>
                    </animated.div>
                </header>

                {/* Page content (revealed after clicking Learn More on desktop, or visible immediately on mobile) */}
                <animated.div
                    style={{
                        ...contentProps,
                        display: !showPageContent && !isMobile ? 'none' : 'block',
                        position: !showPageContent && !isMobile ? 'absolute' : 'relative',
                        visibility: !showPageContent && !isMobile ? 'hidden' : 'visible'
                    }}
                    ref={contentRef}
                >
                    {/* Replaced section-1 with news-container style content if hero is visible */}
                    {isHeroVisible ? (
                        <section className="news-container" style={{ paddingTop: '50px' }}>
                            <div className="section-1-container" style={{ background: 'none', boxShadow: 'none', width: '100%', padding: 0 }}>
                                <div className="home-info-group top-group">
                                    <div className="home-image-box left-image" style={{
                                        backgroundImage: `url(${About})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                        <img
                                            src={About}
                                            alt="About us"
                                            style={{
                                                width: '1px',
                                                height: '1px',
                                                opacity: 0
                                            }}
                                        />
                                    </div>
                                    <div className="home-text-container">
                                        <h2 className="home-info-title">Lorem ipsum dolor sit amet</h2>
                                        <p className="home-info-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan.</p>
                                        <Link to="/about-us" style={{ textDecoration: 'none' }}>
                                            <button className="home-learn-more-button">
                                                <span className="home-learn-more-text">Learn More</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="home-info-group bottom-group">
                                    <div className="home-text-container right-aligned">
                                        <h2 className="home-info-title">Lorem ipsum dolor sit amet</h2>
                                        <p className="home-info-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan.</p>
                                    </div>
                                    <div className="home-image-box right-image" style={{
                                        backgroundImage: `url(${About})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                        <img
                                            src={About}
                                            alt="About us"
                                            style={{
                                                width: '1px',
                                                height: '1px',
                                                opacity: 0
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="section-1">
                            <div className="section-1-container">
                                <div className="home-info-group top-group">
                                    <div className="home-image-box left-image" style={{
                                        backgroundImage: `url(${About})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                        <img
                                            src={About}
                                            alt="About us"
                                            style={{
                                                width: '1px',
                                                height: '1px',
                                                opacity: 0
                                            }}
                                        />
                                    </div>
                                    <div className="home-text-container">
                                        <h2 className="home-info-title">Lorem ipsum dolor sit amet</h2>
                                        <p className="home-info-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan.</p>
                                        <Link to="/about-us" style={{ textDecoration: 'none' }}>
                                            <button className="home-learn-more-button">
                                                <span className="home-learn-more-text">Learn More</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="home-info-group bottom-group">
                                    <div className="home-text-container right-aligned">
                                        <h2 className="home-info-title">Lorem ipsum dolor sit amet</h2>
                                        <p className="home-info-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan.</p>
                                    </div>
                                    <div className="home-image-box right-image" style={{
                                        backgroundImage: `url(${About})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                        <img
                                            src={About}
                                            alt="About us"
                                            style={{
                                                width: '1px',
                                                height: '1px',
                                                opacity: 0
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="trusted" data-aos="fade-up">
                        <h1>Trusted by People</h1>
                        <div className="trusted-container">
                            <div className="trusted-row">
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 1" className="profile-image" />
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 2" className="profile-image" />
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 3" className="profile-image" />
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 4" className="profile-image" />
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 5" className="profile-image" />
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 6" className="profile-image" />
                            </div>
                            <div className="trusted-row">
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 7" className="profile-image" />
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 8" className="profile-image" />
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 9" className="profile-image" />
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 10" className="profile-image" />
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 11" className="profile-image" />
                                <img src={require('../assets/picturetest.jpg')} alt="Profile 12" className="profile-image" />
                            </div>
                        </div>
                    </section>

                    <section className="gallery" data-aos="fade-up">
                        <h1>Inspiring Members</h1>
                        <div className="gallery-container">
                            <div className="text-content">
                                <div className="quote">"GDG revolutionized the way I work with its innovative and user-friendly products."</div>
                                <div className="reviewer">- Some Random Review</div>
                                <a href="#" className="cta-link">See More of Stranger's Story →</a>
                            </div>
                        </div>
                    </section>

                    <section className="wtsup-wrapper">
                        <div className="wtsup-section">
                            <h1 className="wtsup-heading">What's Up?</h1>
                            <div className="wtsup-container">
                                <div className="wtsup-card">
                                    <img src={About} alt="Silhouette" className="wtsup-image" />
                                    <div className="wtsup-content">
                                        <div className="wtsup-header">
                                            <h2 className="wtsup-title">Lorem ipsum dolor sit amet</h2>
                                            <p className="wtsup-time">An hour ago</p>
                                        </div>
                                        <p className="wtsup-description">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.
                                        </p>
                                    </div>
                                </div>
                                <div className="wtsup-card">
                                    <img src={About} alt="Night sky" className="wtsup-image" />
                                    <div className="wtsup-content">
                                        <div className="wtsup-header">
                                            <h2 className="wtsup-title">Lorem ipsum dolor sit amet</h2>
                                            <p className="wtsup-time">An hour ago</p>
                                        </div>
                                        <p className="wtsup-description">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="wtsup-button-container">
                                <Link to="/news" className="wtsup-button">Show More</Link>
                            </div>
                        </div>
                    </section>

                    <section className="cta" data-aos="fade-up">
                        <h1 className="cta-title">Join our community</h1>
                        <div className="cta-container">
                            <div className="cta-content">
                                <h2 className="cta-heading">Ready to become part of our GDG community?</h2>
                                <p className="cta-text">Join our thriving community of developers to learn, share, and grow together. Connect with like-minded individuals and participate in events, workshops, and collaborative projects.</p>
                                <div className="cta-buttons">
                                    <Link to="/contact" style={{ textDecoration: 'none' }}>
                                        <button className="cta-button primary">
                                            <span>Join Now</span>
                                        </button>
                                    </Link>
                                    <Link to="/events" style={{ textDecoration: 'none' }}>
                                        <button className="cta-button secondary">
                                            <span>View Events</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </section>
                </animated.div>
            </main>
            {(showPageContent || isMobile) && <Footer />}
        </>
    );
}

import React, { useEffect, useState, useRef } from 'react';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import './home.css';
import './main.css'
import About from '../assets/sample.png';
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSpring, animated, config } from 'react-spring';
import * as Sentry from '@sentry/react';


export default function Home() {
    const [showPageContent, setShowPageContent] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Create a ref for scrolling to content
    const contentRef = useRef(null);
    // Kind
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

    const [isAnimating, setIsAnimating] = useState(false);

    // Content reveal spring animation
    const contentProps = useSpring({
        opacity: showPageContent ? 1 : 0,
        transform: showPageContent ? 'translateY(0)' : 'translateY(20px)',
        config: { tension: 280, friction: 60 }
    });

    // Circle animations
    // Circle 1 (Blue) -> Moves to Center (Hero Circle 7)
    const circle1Props = useSpring({
        to: isAnimating ? {
            width: 'clamp(240px, 90vmin, 1100px)',
            height: 'clamp(240px, 90vmin, 1100px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #498CF6 0%, #236AD1 100%)'
        } : {
            width: '380px',
            height: '380px',
            top: '-5%',
            left: '-5%',
            transform: 'translate(0%, 0%)',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #498CF6 0%, #236AD1 100%)'
        },
        config: { tension: 120, friction: 14 }
    });

    // Circle 2 (Red) -> Moves to Bottom Right (Hero Circle 8)
    const circle2Props = useSpring({
        to: isAnimating ? {
            width: '8.2vw',
            height: '8.2vw',
            top: '86%',
            left: 'auto',
            right: '2%',
            bottom: 'auto',
            opacity: 1
        } : {
            width: '300px',
            height: '300px',
            top: 'auto',
            left: '14%',
            right: 'auto',
            bottom: '10%',
            opacity: 1
        },
        config: { tension: 120, friction: 14 }
    });

    // Circle 3 (Yellow) -> Moves to Right Top (Hero Circle 5)
    const circle3Props = useSpring({
        to: isAnimating ? {
            width: '12.6vw',
            height: '12.6vw',
            top: '23%',
            left: 'auto',
            right: '0%',
            opacity: 0.8,
            background: 'linear-gradient(135deg, #D9D9D9 0%, #B0B0B0 100%)'
        } : {
            width: '270px',
            height: '270px',
            top: '10%',
            left: 'auto',
            right: '4%',
            opacity: 1,
            background: 'linear-gradient(135deg, #FBC10E 0%, #EB8C05 100%)'
        },
        config: { tension: 120, friction: 14 }
    });

    // Circle 4 (Green) -> Moves to Left Bottom (Hero Circle 1)
    const circle4Props = useSpring({
        to: isAnimating ? {
            width: '4vw',
            height: '4vw',
            top: '90%',
            left: '17%',
            right: 'auto',
            bottom: 'auto',
            opacity: 0.6,
            background: 'linear-gradient(135deg, #D9D9D9 0%, #B0B0B0 100%)'
        } : {
            width: '320px',
            height: '320px',
            top: 'auto',
            left: 'auto',
            right: '-5%',
            bottom: '-10%',
            opacity: 1,
            background: 'linear-gradient(135deg, #4EA865 0%, #1C793A 100%)'
        },
        config: { tension: 120, friction: 14 }
    });

    // Gray Circle 1 -> Moves to Top Left Center (Hero Circle 6)
    const grayCircle1Props = useSpring({
        to: isAnimating ? {
            width: '9vw',
            height: '9vw',
            top: '8%',
            left: '45.5%',
            right: 'auto',
            opacity: 0.7
        } : {
            width: '120px',
            height: '120px',
            top: '15%',
            left: 'auto',
            right: '25%',
            opacity: 0.6
        },
        config: { tension: 120, friction: 14 }
    });

    // Gray Circle 2 -> Moves to Left Center (Hero Circle 4)
    const grayCircle2Props = useSpring({
        to: isAnimating ? {
            width: '6.3vw',
            height: '6.3vw',
            top: '23%',
            left: '16%',
            opacity: 0.6
        } : {
            width: '80px',
            height: '80px',
            top: '40%',
            left: '20%',
            opacity: 0.6
        },
        config: { tension: 120, friction: 14 }
    });

    // Gray Circle 3 -> Moves to Center Left (Hero Circle 3)
    const grayCircle3Props = useSpring({
        to: isAnimating ? {
            width: '4.2vw',
            height: '4.2vw',
            top: '61%',
            left: '38%',
            right: 'auto',
            bottom: 'auto',
            opacity: 0.6
        } : {
            width: '100px',
            height: '100px',
            top: 'auto',
            left: 'auto',
            right: '40%',
            bottom: '30%',
            opacity: 0.6
        },
        config: { tension: 120, friction: 14 }
    });

    // Fade out content
    const headerContentProps = useSpring({
        opacity: isAnimating ? 0 : 1,
        config: { duration: 300 }
    });

    const handleLearnMore = () => {
        setIsAnimating(true);

        // Show the rest of the page content after animation
        setTimeout(() => {
            setShowPageContent(true);
            // Scroll to the content section after a small delay
            setTimeout(() => {
                if (contentRef.current) {
                    contentRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }, 800); // Wait for animation to mostly finish
    };

    return (
        <>
            <NavigationBar />
            <main>
                {/* Hero Section (always visible) */}
                <header className="banner" style={{ position: 'relative', overflow: 'hidden' }}>
                    {/* Colored circles */}
                    <animated.div className="circle" style={{ ...circle1Props, position: 'absolute', zIndex: 0 }}></animated.div>
                    <animated.div className="circle" style={{ ...circle2Props, position: 'absolute', zIndex: 0 }}></animated.div>
                    <animated.div className="circle" style={{ ...circle3Props, position: 'absolute', zIndex: 0 }}></animated.div>
                    <animated.div className="circle" style={{ ...circle4Props, position: 'absolute', zIndex: 0 }}></animated.div>

                    {/* Gray accent circles */}
                    <animated.div className="gray-circle" style={{ ...grayCircle1Props, position: 'absolute', zIndex: 0 }}></animated.div>
                    <animated.div className="gray-circle" style={{ ...grayCircle2Props, position: 'absolute', zIndex: 0 }}></animated.div>
                    <animated.div className="gray-circle" style={{ ...grayCircle3Props, position: 'absolute', zIndex: 0 }}></animated.div>

                    <animated.div className="banner-content" style={headerContentProps}>
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

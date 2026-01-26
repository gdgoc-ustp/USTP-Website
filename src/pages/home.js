import React, { useEffect, useState, useRef, useCallback } from 'react';
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


export default function Home() {
    const [showPageContent, setShowPageContent] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isHeroVisible, setIsHeroVisible] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [latestNews, setLatestNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Testimonial slides data
    const testimonials = [
        {
            image: '/photos/3.jpg',
            quote: '"Joining GDG USTP has been a game-changer for my development journey. The workshops and community support helped me land my first tech internship!"',
            reviewer: '- Ken Tupino and friends (tinuod)',
        },
        {
            image: '/photos/1.jpg',
            quote: '"The hands-on workshops and mentorship I received here gave me the confidence to build my own projects and contribute to open source."',
            reviewer: '- Maria Santos, Web Developer',
        },
        {
            image: '/photos/2.jpg',
            quote: '"GDG USTP connected me with amazing developers and opened doors to opportunities I never thought possible as a student."',
            reviewer: '- James Rivera, Mobile Developer',
        },
    ];

    // Create a ref for scrolling to content
    const contentRef = useRef(null);

    // Gallery slide navigation
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, [testimonials.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

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

    // Fetch latest news posts
    useEffect(() => {
        const fetchLatestNews = async () => {
            try {
                setNewsLoading(true);
                const response = await fetch(
                    `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/blog_posts?select=*&limit=2&order=created_at.desc`,
                    {
                        headers: {
                            "apikey": `${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setLatestNews(data);
                }
            } catch (err) {
                console.error("Error fetching latest news:", err);
            } finally {
                setNewsLoading(false);
            }
        };

        fetchLatestNews();
    }, []);

    // Content reveal spring animation
    const contentProps = useSpring({
        opacity: showPageContent ? 1 : 0,
        transform: showPageContent ? 'translateY(0)' : 'translateY(20px)',
        config: { tension: 280, friction: 60 }
    });

    // Calculate target size for the circle based on window size to match CSS clamp(240px, 90vmin, 1100px)
    const vmin = Math.min(windowSize.width, windowSize.height);
    const targetSize = Math.min(Math.max(240, vmin * 0.9), 1100);

    // Animation for the blue circle (circle1)
    const circleSpring = useSpring({
        to: isHeroVisible ? {
            top: '50%',
            left: '50%',
            width: `${targetSize}px`,
            height: `${targetSize}px`,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            position: 'absolute',
            animation: 'none', // Disable CSS float animation to prevent conflict
            zIndex: 1
        } : {
            top: '-5%',
            left: '-5%',
            width: '380px',
            height: '380px',
            transform: 'translate(0%, 0%)',
            borderRadius: '50%',
            position: 'absolute',
            animation: 'float1 15s infinite ease-in-out', // Re-enable animation
            zIndex: 1
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

                    {/* New Hero Circles (Fade in) - Placed before circle1 so circle1 is on top */}
                    <animated.div className="hero-circles" style={{ ...heroCirclesSpring, position: 'absolute', inset: 0, zIndex: 0 }}>
                        <div className="circle circle-1"></div>
                        <div className="circle circle-2"></div>
                        <div className="circle circle-3"></div>
                        <div className="circle circle-4"></div>
                        <div className="circle circle-5"></div>
                        <div className="circle circle-6"></div>
                        {/* circle-7 is the blue circle animated below */}
                        <div className="circle circle-8"></div>
                    </animated.div>

                    {/* Blue Circle (Transitions between states) */}
                    <animated.div className="circle circle1" style={circleSpring}></animated.div>

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
                                        backgroundImage: `url(/photos/1.jpg)`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                        <img
                                            src="/photos/1.jpg"
                                            alt="GDG USTP Community"
                                            style={{
                                                width: '1px',
                                                height: '1px',
                                                opacity: 0
                                            }}
                                        />
                                    </div>
                                    <div className="home-text-container">
                                        <h2 className="home-info-title">Fostering Innovation & Learning</h2>
                                        <p className="home-info-text">Google Developer Groups on Campus USTP is a vibrant community of passionate developers at the University of Science and Technology of Southern Philippines. We organize events, workshops, and learning opportunities to help students grow their skills and build innovative solutions using Google's developer technologies.</p>
                                        <Link to="/about-us" style={{ textDecoration: 'none' }}>
                                            <button className="wtsup-button" style={{
                                                minWidth: 'auto',
                                                height: '48px',
                                                padding: '12px 28px',
                                                marginTop: '4px',
                                                fontSize: '15px'
                                            }}>
                                                Learn More
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="home-info-group bottom-group">
                                    <div className="home-text-container right-aligned">
                                        <h2 className="home-info-title">Building Tomorrow's Developers</h2>
                                        <p className="home-info-text">Our mission is to create a thriving ecosystem where USTP students can connect, learn, and collaborate on cutting-edge technologies. Through tech talks, hands-on workshops, hackathons, and coding sessions, we provide platforms for knowledge sharing and professional growth in the rapidly evolving tech industry.</p>
                                    </div>
                                    <div className="home-image-box right-image" style={{
                                        backgroundImage: `url(/photos/2.jpg)`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                        <img
                                            src="/photos/2.jpg"
                                            alt="GDG USTP Events"
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
                                        backgroundImage: `url(/photos/1.jpg)`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                        <img
                                            src="/photos/1.jpg"
                                            alt="GDG USTP Community"
                                            style={{
                                                width: '1px',
                                                height: '1px',
                                                opacity: 0
                                            }}
                                        />
                                    </div>
                                    <div className="home-text-container">
                                        <h2 className="home-info-title">Fostering Innovation & Learning</h2>
                                        <p className="home-info-text">Google Developer Groups on Campus USTP is a vibrant community of passionate developers at the University of Science and Technology of Southern Philippines. We organize events, workshops, and learning opportunities to help students grow their skills and build innovative solutions using Google's developer technologies.</p>
                                        <Link to="/about-us" style={{ textDecoration: 'none' }}>
                                            <button className="wtsup-button" style={{
                                                minWidth: 'auto',
                                                height: '48px',
                                                padding: '12px 28px',
                                                marginTop: '4px',
                                                fontSize: '15px'
                                            }}>
                                                Learn More
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="home-info-group bottom-group">
                                    <div className="home-text-container right-aligned">
                                        <h2 className="home-info-title">Building Tomorrow's Developers</h2>
                                        <p className="home-info-text">Our mission is to create a thriving ecosystem where USTP students can connect, learn, and collaborate on cutting-edge technologies. Through tech talks, hands-on workshops, hackathons, and coding sessions, we provide platforms for knowledge sharing and professional growth in the rapidly evolving tech industry.</p>
                                    </div>
                                    <div className="home-image-box right-image" style={{
                                        backgroundImage: `url(/photos/2.jpg)`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                        <img
                                            src="/photos/2.jpg"
                                            alt="GDG USTP Events"
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
                        <h1>Trusted by Organizations</h1>
                        <div className="trusted-container">
                            <div className="trusted-row">
                                <div className="partner-item">
                                    <img src="/partners/xu.jpg" alt="GDG - XU" className="partner-logo" />
                                    <p className="partner-name">GDG - XU</p>
                                </div>
                                <div className="partner-item">
                                    <img src="/partners/gdg-usls.jpg" alt="GDG - USLS" className="partner-logo" />
                                    <p className="partner-name">GDG - USLS</p>
                                </div>
                                <div className="partner-item">
                                    <img src="/partners/DICT.png" alt="DICT Region X" className="partner-logo" />
                                    <p className="partner-name">DICT Region X</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="gallery" data-aos="fade-up">
                        <h1>Inspiring Members</h1>
                        <div className="gallery-container">
                            <button className="gallery-arrow prev" onClick={prevSlide} aria-label="Previous slide" />
                            <div
                                className="gallery-slider"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {testimonials.map((testimonial, index) => (
                                    <div key={index} className="gallery-slide">
                                        <div
                                            className="gallery-image"
                                            style={{
                                                backgroundImage: `url(${testimonial.image})`,
                                            }}
                                        />
                                        <div className="text-content">
                                            <div className="quote">{testimonial.quote}</div>
                                            <div className="reviewer">{testimonial.reviewer}</div>
                                            <Link to="/team" className="cta-link">Meet Our Amazing Team →</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="gallery-arrow next" onClick={nextSlide} aria-label="Next slide" />
                            <div className="gallery-nav">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`gallery-nav-dot ${index === currentSlide ? 'active' : ''}`}
                                        onClick={() => goToSlide(index)}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="wtsup-wrapper">
                        <div className="wtsup-section">
                            <h1 className="wtsup-heading">What's Up?</h1>
                            <div className="wtsup-container">
                                {newsLoading ? (
                                    <div className="loading-container">
                                        <div className="loading-spinner"></div>
                                        <p>Loading latest news...</p>
                                    </div>
                                ) : latestNews.length > 0 ? (
                                    latestNews.map((post) => (
                                        <div key={post.id} className="wtsup-card">
                                            <img 
                                                src={post.image_url 
                                                    ? (post.image_url.startsWith('http') 
                                                        ? post.image_url 
                                                        : `https://yrvykwljzajfkraytbgr.supabase.co/storage/v1/object/public/blog-images/${post.image_url}`)
                                                    : About
                                                } 
                                                alt={post.heading} 
                                                className="wtsup-image" 
                                            />
                                            <div className="wtsup-content">
                                                <div className="wtsup-header">
                                                    <h2 className="wtsup-title">{post.heading}</h2>
                                                    <p className="wtsup-time">
                                                        {(() => {
                                                            const date = new Date(post.created_at);
                                                            const now = new Date();
                                                            const diffTime = Math.abs(now - date);
                                                            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                                                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                                            
                                                            if (diffDays < 1) {
                                                                if (diffHours < 1) {
                                                                    const diffMinutes = Math.floor(diffTime / (1000 * 60));
                                                                    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
                                                                }
                                                                return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                                                            } else if (diffDays === 1) {
                                                                return 'Yesterday';
                                                            } else if (diffDays < 7) {
                                                                return `${diffDays} days ago`;
                                                            }
                                                            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                                                        })()}
                                                    </p>
                                                </div>
                                                <p className="wtsup-description">
                                                    {post.tagline || (() => {
                                                        const doc = new DOMParser().parseFromString(post.description, "text/html");
                                                        const text = doc.body.textContent || "";
                                                        return text.length > 200 ? text.slice(0, 200) + "..." : text;
                                                    })()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="wtsup-card">
                                        <img src="/photos/5.jpg" alt="Placeholder" className="wtsup-image" />
                                        <div className="wtsup-content">
                                            <div className="wtsup-header">
                                                <h2 className="wtsup-title">No news available</h2>
                                                <p className="wtsup-time">Just now</p>
                                            </div>
                                            <p className="wtsup-description">
                                                Check back soon for the latest updates and news from our community.
                                            </p>
                                        </div>
                                    </div>
                                )}
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
                                        <button className="wtsup-button" style={{
                                            minWidth: '120px',
                                            height: '48px',
                                            padding: '12px 24px',
                                            fontSize: '15px'
                                        }}>
                                            Join Now
                                        </button>
                                    </Link>
                                    <Link to="/events" style={{ textDecoration: 'none' }}>
                                        <button className="cta-button secondary" style={{
                                            border: '2px solid #498CF6',
                                            color: '#498CF6',
                                            borderRadius: '100px',
                                            background: 'transparent'
                                        }}>
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

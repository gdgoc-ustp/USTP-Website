import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import './home.css';
import './main.css';
import './news.css';
import '../components/HeroSection.css';
import About from '../assets/sample.png';
import { Link } from "react-router-dom";
import { useSpring, animated, config } from 'react-spring';
import Marquee from '../components/Marquee';
import { SiGithub, SiGoogle } from 'react-icons/si';

import { AnimatePresence, motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

// page order for transitions
const PAGE_ORDER = { '/': 0, '/news': 1, '/events': 2, '/about-us': 3 };
const THEME_COLORS = {
    news: { primary: "#EB483B", secondary: "#B41F19" },
    events: { primary: "#4EA865", secondary: "#1C793A" },
    aboutus: { primary: "#FBC10E", secondary: "#EB8C05" }
};
const PATH_TO_THEME = { '/news': 'news', '/events': 'events', '/about-us': 'aboutus' };

export default function Home() {
    const location = useLocation();
    const previousPath = location.state?.from || null;

    // check local storage for hero state (persists per session)
    const [hasSeenHeroOnMount] = useState(() => {
        return sessionStorage.getItem('heroSeen') === 'true';
    });

    const [showPageContent, setShowPageContent] = useState(hasSeenHeroOnMount);
    // State to force circle2 visibility after transition from News
    const [forceVisible, setForceVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isHeroVisible, setIsHeroVisible] = useState(hasSeenHeroOnMount);
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
            if (mobile) {
                if (!showPageContent) setShowPageContent(true);
                if (!isHeroVisible) setIsHeroVisible(true);
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
                    `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/blog_posts?select=*&limit=3&order=created_at.desc`,
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
        config: { tension: 280, friction: 60 },
        immediate: hasSeenHeroOnMount
    });

    // Calculate target size for the circle based on window size to match CSS clamp(240px, 90vmin, 1100px)
    const vmin = Math.min(windowSize.width, windowSize.height);
    const targetSize = Math.min(Math.max(240, vmin * 0.9), 1100);
    const circle8Size = vmin * 0.082;

    const prevIndex = PAGE_ORDER[previousPath] ?? -1;
    const currentIndex = PAGE_ORDER['/'];
    const navigatingLeft = prevIndex > currentIndex;
    const skipAmount = navigatingLeft ? prevIndex - currentIndex : 0;
    const isSequentialLeft = hasSeenHeroOnMount && previousPath && navigatingLeft && skipAmount === 1;

    // Responsive landing props for circle2 - converted to pixels for smooth spring animation
    const getLandingCircle2Props = () => {
        const w = windowSize.width;
        const h = windowSize.height;
        // Default desktop props
        let props = { width: 300, height: 300, leftPct: 0.14, bottomPct: 0.10 };

        if (w < 480) props = { width: 150, height: 150, leftPct: 0, bottomPct: 0.15 };
        else if (w < 768) props = { width: 200, height: 200, leftPct: 0.02, bottomPct: 0.12 };
        else if (w < 1200) props = { width: 250, height: 250, leftPct: 0.14, bottomPct: 0.10 };

        // Convert to absolute pixels to avoid 'auto' vs '%' interpolation issues
        const left = w * props.leftPct;
        const top = h * (1 - props.bottomPct) - props.height;

        return {
            left,
            top,
            width: props.width,
            height: props.height
        };
    };
    const landingC2 = getLandingCircle2Props();

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
        config: config.molasses,
        immediate: hasSeenHeroOnMount
    });

    // Animation for the red circle (circle2 -> circle-8 position)
    const bannerHeightHero = Math.min(Math.max(360, windowSize.height * 0.6), 720);
    const circle2Spring = useSpring({
        to: isHeroVisible ? {
            left: windowSize.width * 0.98 - circle8Size,
            top: bannerHeightHero * 0.86,
            width: circle8Size,
            height: circle8Size,
            opacity: isSequentialLeft && !forceVisible ? 0 : 1 // Hide if duplicate (News -> Home) until delay
        } : {
            left: landingC2.left,
            top: landingC2.top,
            width: landingC2.width,
            height: landingC2.height,
            opacity: 1
        },
        config: config.molasses,
        immediate: hasSeenHeroOnMount
    });

    // Add delay for circle-2 appearance if duplicate
    useEffect(() => {
        if (isSequentialLeft && isHeroVisible) {
            const timeout = setTimeout(() => {
                setForceVisible(true);
            }, 800);
            return () => clearTimeout(timeout);
        } else {
            setForceVisible(false);
        }
    }, [isSequentialLeft, isHeroVisible]);

    // Better approach for delayed fade-in: separate spring or animated value?
    // Since we are using useSpring declarative, we can use a delay prop in the config?
    // But opacity depends on 'isSequentialLeft' which is constant.
    // 'isSequentialLeft' is true for the whole duration.
    // So "opacity: 0" remains 0!
    // We need "opacity: 1" eventually.
    // We can use the 'delay' prop in useSpring?
    // "delay: isSequentialLeft ? 800 : 0".
    // And "opacity: 1" always?
    // If we set opacity: 1 and delay: 800.
    // Then on mount, it waits 800s before applying opacity: 1?
    // Initial state is applied immediately?
    // If loading from News, we mount fresh.
    // immediate: hasSeenHeroOnMount is true.
    // So it jumps to "to" state.
    // We need to override "immediate" for opacity?

    // Let's stick thereto:
    // If isSequentialLeft, we want opacity 0 -> 1 over time.
    // This is handled by spring interpolation if we change values.
    // But value is constant 1?
    // Correct fix: use a ref or state for 'delayedOpacity'.

    // Simplification: We will trust that removing the 'motion.div' logic we had needs to be replaced.
    // My previous 'motion.div' logic had `initial: 0, animate: 1, delay: 0.8`.
    // I can replicate that with useSpring using 'from' and 'to'?
    // On mount (News->Home):
    // from: { opacity: isSequentialLeft ? 0 : 1 }
    // to: { opacity: 1 }
    // delay: isSequentialLeft ? 800 : 0.

    // But useSpring handles updates.
    // Let's refine the spring definition in the code block.

    // Animation for fading out initial banner content
    const bannerContentSpring = useSpring({
        opacity: isHeroVisible ? 0 : 1,
        transform: isHeroVisible ? 'translateY(-20px)' : 'translateY(0px)',
        pointerEvents: isHeroVisible ? 'none' : 'auto',
        config: config.molasses,
        immediate: hasSeenHeroOnMount
    });

    // Animation for fading in new hero title
    const heroTitleSpring = useSpring({
        opacity: isHeroVisible ? 1 : 0,
        transform: isHeroVisible ? 'translateY(0px)' : 'translateY(20px)',
        pointerEvents: isHeroVisible ? 'auto' : 'none',
        delay: hasSeenHeroOnMount ? 0 : 200,
        config: config.molasses,
        immediate: hasSeenHeroOnMount
    });

    // Animation for new hero circles
    const heroCirclesSpring = useSpring({
        opacity: isHeroVisible ? 1 : 0,
        config: config.molasses,
        immediate: hasSeenHeroOnMount
    });

    const handleLearnMore = () => {
        setIsHeroVisible(true);
        sessionStorage.setItem('heroSeen', 'true');

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
        <div id="overhaul-v2-root">
            <NavigationBar />
            <main>
                {/* Hero Section (always visible) */}
                <header className="banner" style={{ height: isHeroVisible ? 'clamp(360px, 60svh, 720px)' : '100vh', transition: 'height 0.8s ease-in-out' }}>

                    {/* Mobile Mesh Background (Shared with HeroSection) - Moved outside animated wrapper to persist */}
                    <div className="mobile-hero-background">
                        <div className="mesh-blob blob-blue"></div>
                        <div className="mesh-blob blob-red"></div>
                        <div className="mesh-blob blob-yellow"></div>
                        <div className="mesh-blob blob-green"></div>
                    </div>

                    {/* Initial Banner Circles - Wrapped to preserve positioning context */}
                    <animated.div style={{ ...bannerContentSpring, position: 'absolute', inset: 0, zIndex: 0 }}>
                        {/* circle2 removed, handled globally */}
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
                        {/* circle-2 removed, handled globally as circle2 */}
                        <div className="circle circle-3"></div>
                        <div className="circle circle-4"></div>
                        <div className="circle circle-5"></div>
                        <div className="circle circle-6"></div>
                        {/* circle-8 removed, handled globally as circle2 (which becomes circle-8) */}
                    </animated.div>

                    {/* Old circle-8 exit animation (animates DOWN and fades out when navigating left to home) */}
                    {hasSeenHeroOnMount && previousPath && PATH_TO_THEME[previousPath] && (() => {
                        const prevIndex = PAGE_ORDER[previousPath] ?? -1;
                        const currentIndex = PAGE_ORDER['/'];
                        const navigatingLeft = prevIndex > currentIndex;
                        const skipAmount = navigatingLeft ? prevIndex - currentIndex : 0;
                        const circle8Size = Math.min(windowSize.width, windowSize.height) * 0.082;

                        // old circle-8 is the page to the RIGHT of the previous page
                        const oldCircle8Index = prevIndex + 1;
                        const oldCircle8Path = { 0: '/', 1: '/news', 2: '/events', 3: '/about-us' }[oldCircle8Index];
                        const oldCircle8Theme = oldCircle8Path ? { '/': 'home', '/news': 'news', '/events': 'events', '/about-us': 'aboutus' }[oldCircle8Path] : null;
                        const oldCircle8Colors = oldCircle8Theme ? THEME_COLORS[oldCircle8Theme] : null;

                        if (!navigatingLeft || !oldCircle8Colors) return null;

                        return (
                            <motion.div
                                className="transition-circle"
                                initial={{ left: `calc(98% - ${circle8Size}px)`, top: '86%', width: circle8Size, height: circle8Size, opacity: 1 }}
                                animate={{ left: `calc(98% - ${circle8Size}px)`, top: '120%', width: circle8Size, height: circle8Size, opacity: 0 }}
                                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                                style={{
                                    position: 'absolute',
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${oldCircle8Colors.primary} 0%, ${oldCircle8Colors.secondary} 100%)`,
                                    zIndex: 0
                                }}
                            />
                        );
                    })()}

                    {/* Exiting circle when navigating TO home from another hero page */}
                    {hasSeenHeroOnMount && previousPath && PATH_TO_THEME[previousPath] && (() => {
                        const prevTheme = PATH_TO_THEME[previousPath];
                        const prevColors = THEME_COLORS[prevTheme];
                        const prevIndex = PAGE_ORDER[previousPath] ?? -1;
                        const currentIndex = PAGE_ORDER['/'];
                        const navigatingLeft = prevIndex > currentIndex;
                        const skipAmount = navigatingLeft ? prevIndex - currentIndex : 0;
                        const isSequentialLeft = navigatingLeft && skipAmount === 1;
                        const isSkipLeft = navigatingLeft && skipAmount > 1;
                        const circle8Size = Math.min(windowSize.width, windowSize.height) * 0.082;

                        return (
                            <motion.div
                                className="transition-circle"
                                initial={{ left: '50%', top: '50%', width: targetSize, height: targetSize, x: '-50%', y: '-50%', opacity: 1 }}
                                animate={isSequentialLeft ? {
                                    // sequential left: exiting to circle-8 position (bottom right) - stays visible
                                    left: `calc(98% - ${circle8Size}px)`,
                                    top: '86%',
                                    width: circle8Size,
                                    height: circle8Size,
                                    x: '0%',
                                    y: '0%',
                                    opacity: 1
                                } : isSkipLeft ? {
                                    // skip left: exits to the RIGHT (not becoming circle-8)
                                    left: '120%',
                                    top: '50%',
                                    width: circle8Size,
                                    height: circle8Size,
                                    x: '-50%',
                                    y: '-50%',
                                    opacity: 0
                                } : {
                                    // navigating right (shouldn't happen for home since it's index 0)
                                    left: '-20%',
                                    top: '50%',
                                    width: circle8Size,
                                    height: circle8Size,
                                    x: '-50%',
                                    y: '-50%',
                                    opacity: 0
                                }}
                                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                                style={{
                                    position: 'absolute',
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${prevColors.primary} 0%, ${prevColors.secondary} 100%)`,
                                    zIndex: 1
                                }}
                            />
                        );
                    })()}


                    {hasSeenHeroOnMount && previousPath && PAGE_ORDER[previousPath] !== undefined ? (() => {
                        const prevIndex = PAGE_ORDER[previousPath] ?? -1;
                        const currentIndex = PAGE_ORDER['/'];
                        const navigatingLeft = prevIndex > currentIndex;
                        const circle8Size = Math.min(windowSize.width, windowSize.height) * 0.082;

                        return (
                            <motion.div
                                className="circle"
                                initial={navigatingLeft ? {
                                    // coming from left side
                                    left: '-20%',
                                    top: '50%',
                                    width: circle8Size,
                                    height: circle8Size,
                                    x: '-50%',
                                    y: '-50%'
                                } : {
                                    // coming from circle-8 position
                                    left: `calc(98% - ${circle8Size}px)`,
                                    top: '86%',
                                    right: 'auto',
                                    width: circle8Size,
                                    height: circle8Size,
                                    x: '0%',
                                    y: '0%'
                                }}
                                animate={{ left: '50%', right: 'auto', top: '50%', width: targetSize, height: targetSize, x: '-50%', y: '-50%' }}
                                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                                style={{
                                    position: 'absolute',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #498CF6 0%, #236AD1 100%)',
                                    zIndex: 2
                                }}
                            />
                        );
                    })() : (
                        <animated.div className="circle circle1" style={circleSpring}></animated.div>
                    )}

                    {/* Global Red Circle (circle2) - Transitions from banner to circle-8 position */}
                    <animated.div
                        className="circle circle2"
                        style={{
                            ...circle2Spring,
                            borderRadius: '50%',
                            position: 'absolute',
                            zIndex: isHeroVisible ? 1 : 0,
                            animation: isHeroVisible ? 'none' : 'float2 15s infinite ease-in-out'
                        }}
                    />

                    {/* Banner Content (Text/Button) - Hidden on Mobile */}
                    {!isMobile && (
                        <animated.div style={{ ...bannerContentSpring, zIndex: 2, position: 'relative' }}>
                            <div className="banner-content">
                                <h1 className="banner-title">
                                    Building Good Things, <span className="color-text">Together!</span>
                                </h1>
                                <p>
                                    Google Developer Groups on Campus - USTP
                                </p>
                                <button
                                    className="banner-button"
                                    onClick={handleLearnMore}
                                >
                                    Learn More
                                </button>
                            </div>
                        </animated.div>
                    )}

                    <animated.div style={{ ...heroTitleSpring, position: 'absolute', zIndex: 10 }}>
                        <h1 className="home-hero-title">Home</h1>
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


                    <section className="py-24 px-4 bg-gray-50" data-aos="fade-up">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">

                                {/* 1. Main Intro (Spans 2x2) */}
                                <div className="md:col-span-2 lg:row-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden group flex flex-col justify-center">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                                    <div className="relative z-10">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-bold mb-6">
                                            <SiGoogle className="text-xl" />
                                            <span>Who We Are</span>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 font-google-sans leading-tight">
                                            Fostering <span className="text-blue-600">Innovation</span>, <br className="hidden lg:block" /> Building Community
                                        </h2>
                                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                                            A platform for students to grow skills, connect with peers, and build solutions using Google technologies.
                                        </p>
                                        <Link to="/about-us">
                                            <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2">
                                                More About Us <span className="text-xl">→</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* 2. Tall Image Tower (Spans 1x2 on LG) */}
                                <div className="md:col-span-1 lg:row-span-2 rounded-[2.5rem] overflow-hidden shadow-sm relative min-h-[400px] h-full group order-2 lg:order-none">
                                    <img
                                        src="/photos/1.jpg"
                                        alt="Community"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <p className="font-bold text-2xl mb-1 font-google-sans">Community First</p>
                                        <p className="text-sm opacity-90">Growing together</p>
                                    </div>
                                </div>

                                {/* 3. Small Stat Tile (Spans 1x1) */}
                                <div className="md:col-span-1 rounded-[2.5rem] bg-yellow-400 p-8 shadow-sm flex flex-col justify-center items-center text-center group hover:-translate-y-1 transition-transform duration-300">
                                    <p className="text-5xl font-bold text-gray-900 mb-2 font-google-sans">50+</p>
                                    <p className="text-sm font-bold uppercase tracking-wider text-gray-800">Events Hosted</p>
                                </div>

                                {/* 4. Social/Action Tile (Spans 1x1) */}
                                <a
                                    href="https://github.com/gdgoc-ustp/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="md:col-span-1 bg-gray-900 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center shadow-lg group hover:bg-gray-800 transition-colors cursor-pointer decoration-none"
                                >
                                    <SiGithub className="text-5xl text-white mb-4 group-hover:scale-110 transition-transform" />
                                    <p className="text-white font-bold text-lg">Open Source</p>
                                    <p className="text-gray-400 text-sm">Contribute</p>
                                </a>

                                {/* 5. Mission Card (Spans 2x1 Wide) */}
                                <div className="md:col-span-2 bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700"></div>
                                    <div className="relative z-10 flex-1">
                                        <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">Our Mission</div>
                                        <h3 className="text-3xl font-bold font-google-sans leading-tight">Building Tomorrow's Developers</h3>
                                    </div>
                                    <div className="relative z-10 flex-shrink-0">
                                        <Link to="/events" className="inline-flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                                            <span className="text-xl">→</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* 6. Wide Image Tile (Spans 2x1) */}
                                <div className="md:col-span-2 rounded-[2.5rem] overflow-hidden shadow-sm relative h-[240px] group">
                                    <img
                                        src="/photos/2.jpg"
                                        alt="Workshops"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/10 transition-colors duration-300"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <p className="font-bold text-2xl font-google-sans drop-shadow-lg">Hands-on Workshops</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>


                    <section className="py-24 bg-gray-50/50" data-aos="fade-up">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="flex flex-col items-center mb-16">
                                <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                                    Our Network
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 font-google-sans leading-tight">
                                    Trusted by Organizations
                                </h1>
                            </div>

                            <div className="relative">
                                {/* Side masks for smoother fade */}
                                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50/50 to-transparent z-10 pointer-events-none"></div>
                                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50/50 to-transparent z-10 pointer-events-none"></div>

                                <div className="py-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                    <Marquee speed={35} pauseOnHover={true}>
                                        <div className="flex items-center gap-16 px-8">
                                            <div className="opacity-40 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer">
                                                <img src="/partners/xu.jpg" alt="GDG - XU" className="h-12 w-auto object-contain" />
                                            </div>
                                            <div className="opacity-40 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer">
                                                <img src="/partners/gdg-usls.jpg" alt="GDG - USLS" className="h-12 w-auto object-contain" />
                                            </div>
                                            <div className="opacity-40 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer">
                                                <img src="/partners/DICT.png" alt="DICT Region X" className="h-14 w-auto object-contain" />
                                            </div>
                                            <div className="opacity-40 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-pointer flex items-center gap-3">
                                                <SiGoogle className="text-3xl" />
                                                <span className="font-bold text-xl text-gray-700">Google</span>
                                            </div>
                                            {/* Repeating for seamless loop if needed, though Marquee usually handles this */}
                                        </div>
                                    </Marquee>
                                </div>
                            </div>
                        </div>
                    </section>



                    <section className="py-24 px-4 bg-gray-50" data-aos="fade-up">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 font-google-sans">What's Up?</h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                                {newsLoading ? (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
                                        <div className="loading-spinner mb-4 w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                        <p className="text-xl text-gray-600 font-medium">Loading latest news...</p>
                                    </div>
                                ) : latestNews.length > 0 ? (
                                    latestNews.map((post) => (
                                        <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
                                            <div className="h-64 lg:h-80 overflow-hidden relative">
                                                <img
                                                    src={post.image_url
                                                        ? (post.image_url.startsWith('http')
                                                            ? post.image_url
                                                            : `https://yrvykwljzajfkraytbgr.supabase.co/storage/v1/object/public/blog-images/${post.image_url}`)
                                                        : About
                                                    }
                                                    alt={post.heading}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                                            </div>

                                            <div className="p-8 flex flex-col flex-grow relative">
                                                {/* Floating Date Badge */}
                                                <div className="absolute -top-5 right-8 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg tracking-wide uppercase">
                                                    {(() => {
                                                        const date = new Date(post.created_at);
                                                        const now = new Date();
                                                        const diffTime = Math.abs(now - date);
                                                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                                                        if (diffDays < 7) {
                                                            return diffDays === 0 ? 'Today' : (diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`);
                                                        }
                                                        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                                                    })()}
                                                </div>

                                                <div className="mb-4 mt-2">
                                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 font-google-sans leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{post.heading}</h2>
                                                </div>

                                                <div className="text-gray-600 text-lg leading-relaxed mb-8 line-clamp-3">
                                                    {post.tagline || (() => {
                                                        const doc = new DOMParser().parseFromString(post.description, "text/html");
                                                        const text = doc.body.textContent || "";
                                                        return text;
                                                    })()}
                                                </div>

                                                <Link
                                                    to={`/news/article/${post.id}`}
                                                    className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between text-blue-600 font-bold group-hover:translate-x-2 transition-transform duration-300 cursor-pointer text-lg"
                                                >
                                                    Read Article <span className="text-2xl transform transition-transform group-hover:translate-x-1">→</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                                        <div className="bg-gray-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-google-sans">No news available</h2>
                                        <p className="text-gray-500 text-lg">Check back soon for the latest updates from our community.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-16 flex justify-center">
                                <Link to="/news" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-full text-lg border-2 border-blue-100 hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg">
                                    Show More News
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </Link>
                            </div>
                        </div>
                    </section>


                    <section className="py-24 px-4 bg-white relative overflow-hidden" data-aos="fade-up">
                        {/* Geometric decorations */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-60"></div>

                        <div className="max-w-7xl mx-auto relative z-10 text-center">
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 font-google-sans leading-tight">
                                Join our <span className="text-blue-600">Community</span>
                            </h1>

                            <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-2xl">
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                                    Ready to build the future?
                                </h2>
                                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                    Join our thriving community of developers to learn, share, and grow together.
                                    Connect with like-minded individuals and participate in events, workshops, and collaborative projects.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Link to="/register" className="w-full sm:w-auto">
                                        <button className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-full text-xl shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
                                            Join Now
                                        </button>
                                    </Link>
                                    <Link to="/events" className="w-full sm:w-auto">
                                        <button className="w-full sm:w-auto px-10 py-5 bg-white text-gray-800 font-bold rounded-full text-xl border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                            View Events
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </animated.div>
                {(showPageContent || isMobile) && <Footer />}
            </main>
        </div>
    );
}

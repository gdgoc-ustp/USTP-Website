import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./HeroSection.css";

// page order for determining transition direction
const PAGE_ORDER = {
  '/': 0,
  '/news': 1,
  '/events': 2,
  '/about-us': 3
};

const THEME_COLORS = {
  home: {
    primary: "#498CF6",
    secondary: "#236AD1",
  },
  news: {
    primary: "#EB483B",
    secondary: "#B41F19",
  },
  events: {
    primary: "#4EA865",
    secondary: "#1C793A",
  },
  aboutus: {
    primary: "#FBC10E",
    secondary: "#EB8C05",
  }
};

const PATH_TO_THEME = {
  '/': 'home',
  '/news': 'news',
  '/events': 'events',
  '/about-us': 'aboutus'
};

const HeroSection = ({ title, theme, previousPath }) => {
  const colors = THEME_COLORS[theme] || THEME_COLORS.news;

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const vmin = Math.min(windowSize.width, windowSize.height);
  const targetSize = Math.min(Math.max(240, vmin * 0.9), 1100);
  const smallSize = targetSize * 0.15;

  // determine direction based on page order
  const currentIndex = PAGE_ORDER[`/${theme === 'aboutus' ? 'about-us' : theme === 'home' ? '' : theme}`] ?? 1;
  const previousIndex = PAGE_ORDER[previousPath] ?? -1;

  // if no valid previous path or same page, no transition
  const hasValidTransition = previousIndex !== -1 && previousIndex !== currentIndex;

  // true = coming from left (need to enter from right), false = coming from right (enter from left)
  const enterFromRight = previousIndex < currentIndex;

  // get previous page's colors for the exiting circle
  const previousTheme = PATH_TO_THEME[previousPath] || null;
  const previousColors = previousTheme ? THEME_COLORS[previousTheme] : null;

  // animation variants for the main (incoming) circle
  const mainCircleVariants = {
    initial: hasValidTransition ? {
      left: enterFromRight ? '120%' : '-20%',
      top: '50%',
      width: smallSize,
      height: smallSize,
      x: '-50%',
      y: '-50%'
    } : {
      left: '50%',
      top: '50%',
      width: targetSize,
      height: targetSize,
      x: '-50%',
      y: '-50%'
    },
    animate: {
      left: '50%',
      top: '50%',
      width: targetSize,
      height: targetSize,
      x: '-50%',
      y: '-50%',
      transition: {
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // animation variants for the exiting circle
  const exitCircleVariants = {
    initial: {
      left: '50%',
      top: '50%',
      width: targetSize,
      height: targetSize,
      x: '-50%',
      y: '-50%',
      opacity: 1
    },
    animate: {
      left: enterFromRight ? '-20%' : '120%',
      top: '50%',
      width: smallSize,
      height: smallSize,
      x: '-50%',
      y: '-50%',
      opacity: 0,
      transition: {
        duration: 0.9,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section className={`hero-section ${theme}-theme`}>
      <div className="hero-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-5"></div>
        <div className="circle circle-6"></div>

        {/* exiting circle (previous page's color) */}
        {hasValidTransition && previousColors && (
          <motion.div
            className="circle"
            variants={exitCircleVariants}
            initial="initial"
            animate="animate"
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${previousColors.primary} 0%, ${previousColors.secondary} 100%)`,
              zIndex: 1
            }}
          />
        )}

        {/* main (incoming) circle */}
        <motion.div
          className="circle"
          variants={mainCircleVariants}
          initial="initial"
          animate="animate"
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            zIndex: 2
          }}
        />

        {/* accent circle (circle-8) */}
        <div
          className="circle circle-8"
          style={{
            background: `linear-gradient(135deg, ${THEME_COLORS[theme === 'news' ? 'events' : theme === 'events' ? 'aboutus' : theme === 'aboutus' ? 'news' : 'news']?.primary} 0%, ${THEME_COLORS[theme === 'news' ? 'events' : theme === 'events' ? 'aboutus' : theme === 'aboutus' ? 'news' : 'news']?.secondary} 100%)`
          }}
        ></div>
      </div>
      <div className="hero-content">
        <h1>{title}</h1>
      </div>
    </section>
  );
};

export default HeroSection;
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./HeroSection.css";

// page order: [Home, News, Events, About Us]
const PAGE_ORDER = {
  '/': 0,
  '/news': 1,
  '/events': 2,
  '/about-us': 3
};

const INDEX_TO_PATH = {
  0: '/',
  1: '/news',
  2: '/events',
  3: '/about-us'
};

const THEME_COLORS = {
  home: { primary: "#498CF6", secondary: "#236AD1" },
  news: { primary: "#EB483B", secondary: "#B41F19" },
  events: { primary: "#4EA865", secondary: "#1C793A" },
  aboutus: { primary: "#FBC10E", secondary: "#EB8C05" }
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
  const circle8Size = vmin * 0.082; // matches CSS .circle-8 size

  // current page index
  const currentPath = `/${theme === 'aboutus' ? 'about-us' : theme === 'home' ? '' : theme}`;
  const currentIndex = PAGE_ORDER[currentPath] ?? 1;
  const previousIndex = PAGE_ORDER[previousPath] ?? -1;

  // navigation direction
  const hasValidTransition = previousIndex !== -1 && previousIndex !== currentIndex;
  const navigatingRight = previousIndex < currentIndex; // going to higher index (e.g., Events -> About Us)
  const navigatingLeft = previousIndex > currentIndex; // going to lower index (e.g., About Us -> Events)

  // skip detection for left navigation
  const skipAmount = navigatingLeft ? previousIndex - currentIndex : 0;
  const isSequentialLeft = navigatingLeft && skipAmount === 1;
  const isSkipLeft = navigatingLeft && skipAmount > 1;

  // skip detection for right navigation
  const skipAmountRight = navigatingRight ? currentIndex - previousIndex : 0;
  const isSequentialRight = navigatingRight && skipAmountRight === 1;
  const isSkipRight = navigatingRight && skipAmountRight > 1;

  // next page to the right (for circle-8 color on current page)
  const nextRightIndex = currentIndex + 1;
  const nextRightPath = INDEX_TO_PATH[nextRightIndex];
  const nextRightTheme = nextRightPath ? PATH_TO_THEME[nextRightPath] : null;
  const nextRightColors = nextRightTheme ? THEME_COLORS[nextRightTheme] : null;

  // old circle-8 color (page to the RIGHT of previous page - this exits down when navigating left)
  const oldCircle8Index = previousIndex + 1;
  const oldCircle8Path = INDEX_TO_PATH[oldCircle8Index];
  const oldCircle8Theme = oldCircle8Path ? PATH_TO_THEME[oldCircle8Path] : null;
  const oldCircle8Colors = oldCircle8Theme ? THEME_COLORS[oldCircle8Theme] : null;

  // previous page colors (for exiting circle when navigating left)
  const previousTheme = PATH_TO_THEME[previousPath] || null;
  const previousColors = previousTheme ? THEME_COLORS[previousTheme] : null;

  // circle-8 position (bottom right corner)
  const circle8Position = { right: '2%', top: '86%' };

  return (
    <section className={`hero-section ${theme}-theme`}>
      <div className="mobile-hero-background">
        <div className="mesh-blob blob-blue"></div>
        <div className="mesh-blob blob-red"></div>
        <div className="mesh-blob blob-yellow"></div>
        <div className="mesh-blob blob-green"></div>
      </div>
      <div className="hero-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-5"></div>
        <div className="circle circle-6"></div>

        {/* when navigating RIGHT: circle comes FROM circle-8, old exits left */}
        {/* when navigating LEFT sequential: old circle shrinks TO circle-8 position, new comes from left */}
        {/* when navigating LEFT skip: old circle exits RIGHT, old circle-8 fades down, new circle-8 animates up */}

        {/* old circle-8 exit animation (animates DOWN and fades out when navigating left) */}
        {hasValidTransition && navigatingLeft && oldCircle8Colors && (
          <motion.div
            className="circle"
            initial={{
              left: `calc(98% - ${circle8Size}px)`,
              top: circle8Position.top,
              width: circle8Size,
              height: circle8Size,
              opacity: 1
            }}
            animate={{
              left: `calc(98% - ${circle8Size}px)`,
              top: '120%',
              width: circle8Size,
              height: circle8Size,
              opacity: 0,
              transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }
            }}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${oldCircle8Colors.primary} 0%, ${oldCircle8Colors.secondary} 100%)`,
              zIndex: 0
            }}
          />
        )}

        {/* exiting circle (previous page's color) */}
        {/* We use left/top for all animations to ensure smooth interpolation by Framer Motion */}
        {hasValidTransition && previousColors && (
          <motion.div
            className="circle"
            initial={{
              left: '50%',
              top: '50%',
              width: targetSize,
              height: targetSize,
              x: '-50%',
              y: '-50%',
              opacity: 1
            }}
            animate={isSequentialLeft ? {
              // sequential left: previous circle shrinks TO circle-8 position
              // We calculate left position: 100% - 2% (right margin) - circle8Size
              left: `calc(98% - ${circle8Size}px)`,
              top: '86%',
              width: circle8Size,
              height: circle8Size,
              x: '0%', // Reset transform since we're positioning by top-left
              y: '0%',
              opacity: 1,
              transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }
            } : isSkipLeft ? {
              // skip left: previous circle exits to the RIGHT (not becoming circle-8)
              left: '120%',
              top: '50%',
              width: circle8Size,
              height: circle8Size,
              x: '-50%',
              y: '-50%',
              opacity: 0,
              transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }
            } : navigatingRight ? {
              // navigating RIGHT: previous circle exits to the left and fades
              left: '-20%',
              top: '50%',
              width: circle8Size,
              height: circle8Size,
              x: '-50%',
              y: '-50%',
              opacity: 0,
              transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }
            } : {
              // fallback
              opacity: 0,
              transition: { duration: 0.9 }
            }}
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
          initial={hasValidTransition ? (navigatingRight ? (isSequentialRight ? {
            // when going RIGHT (sequential), incoming circle comes FROM circle-8 position (bottom right)
            left: 'auto',
            right: circle8Position.right,
            top: circle8Position.top,
            width: circle8Size,
            height: circle8Size,
            x: '0%',
            y: '0%'
          } : {
            // when going RIGHT (skip), incoming circle comes from the right side
            left: '120%',
            top: '50%',
            width: circle8Size,
            height: circle8Size,
            x: '-50%',
            y: '-50%'
          }) : {
            // when going LEFT, incoming circle comes from the left side
            left: '-20%',
            top: '50%',
            width: circle8Size,
            height: circle8Size,
            x: '-50%',
            y: '-50%'
          }) : {
            left: '50%',
            top: '50%',
            width: targetSize,
            height: targetSize,
            x: '-50%',
            y: '-50%'
          }}
          animate={{
            left: '50%',
            right: 'auto',
            top: '50%',
            width: targetSize,
            height: targetSize,
            x: '-50%',
            y: '-50%',
            transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }
          }}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            zIndex: 2
          }}
        />

        {/* circle-8: uses motion.div with inline styles (no CSS class positioning) */}
        {nextRightColors && (
          <motion.div
            key={isSkipLeft ? 'skip-circle8' : isSequentialLeft ? 'seq-circle8' : 'static-circle8'}
            initial={isSkipLeft ? {
              position: 'absolute',
              left: `calc(98% - ${circle8Size}px)`,
              top: '120%',
              width: circle8Size,
              height: circle8Size,
              opacity: 0
            } : isSequentialLeft ? {
              position: 'absolute',
              left: `calc(98% - ${circle8Size}px)`,
              top: '86%',
              width: circle8Size,
              height: circle8Size,
              opacity: 0 // Start hidden to avoid duplicate with incoming circle
            } : {
              position: 'absolute',
              left: `calc(98% - ${circle8Size}px)`,
              top: '86%',
              width: circle8Size,
              height: circle8Size,
              opacity: 1
            }}
            animate={isSequentialLeft ? {
              position: 'absolute',
              left: `calc(98% - ${circle8Size}px)`,
              top: '86%',
              width: circle8Size,
              height: circle8Size,
              opacity: 1,
              transition: { duration: 0.1, delay: 0.8 } // Fade in after transition
            } : {
              position: 'absolute',
              left: `calc(98% - ${circle8Size}px)`,
              top: '86%',
              width: circle8Size,
              height: circle8Size,
              opacity: 1,
              transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }
            }}
            style={{
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${nextRightColors.primary} 0%, ${nextRightColors.secondary} 100%)`
            }}
          />
        )}
      </div>
      <div className="hero-content">
        <h1>{title}</h1>
      </div>
    </section>
  );
};

export default HeroSection;
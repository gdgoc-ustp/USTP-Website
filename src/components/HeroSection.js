import React from "react";
import "./HeroSection.css";

const HeroSection = ({ title, theme }) => {
  // Define color variables based on theme
  let gradientColors = {
    news: {
      primary: "#EB483B",
      secondary: "#B41F19",
      accent: { primary: "#4EA865", secondary: "#1C793A" }
    },
    events: {
      primary: "#4EA865",
      secondary: "#1C793A",
      accent: { primary: "#FBC10E", secondary: "#EB8C05" }
    },
    aboutus: {
      primary: "#FBC10E",
      secondary: "#EB8C05",
      accent: { primary: "#EB483B", secondary: "#B41F19" }
    },
    home: {
      primary: "#498CF6",
      secondary: "#236AD1",
      accent: { primary: "#EB483B", secondary: "#B41F19" }
    }
  };

  // Default to news theme if not specified
  const colors = gradientColors[theme] || gradientColors.news;

  return (
    <section className={`hero-section ${theme}-theme`}>
      <div className="hero-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-5"></div>
        <div className="circle circle-6"></div>
        <div 
          className="circle circle-7"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
          }}
        ></div>
        <div 
          className="circle circle-8"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`
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
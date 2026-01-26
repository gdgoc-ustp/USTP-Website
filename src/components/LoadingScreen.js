import React from 'react';
import './LoadingScreen.css';
import Logo from '../assets/logo.png';

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="logo-container">
                    <div className="loading-ring"></div>
                    <img src={Logo} alt="GDG Logo" className="loading-logo" />
                </div>
                <p className="loading-text">Building good things together</p>
            </div>
        </div>
    );
};

export default LoadingScreen;

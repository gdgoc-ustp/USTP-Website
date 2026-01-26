import React from 'react';
import './Marquee.css';

const Marquee = ({ children, direction = 'left', speed = 20, pauseOnHover = false, className = '' }) => {
    // spin it right round baby right round like a record baby
    return (
        <div className={`marquee-container ${className}`}>
            <div
                className={`marquee-content ${direction === 'right' ? 'animate-scroll-right' : 'animate-scroll-left'} ${pauseOnHover ? 'pause-on-hover' : ''}`}
                style={{ '--duration': `${speed}s` }}
            >
                {/* Duplicate content multiple times for seamless loop on wide screens */}
                {children}
                {children}
                {children}
                {children}
            </div>
        </div>
    );
};

export default Marquee;

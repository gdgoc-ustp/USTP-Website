import React, { useEffect, useState } from 'react';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import HeroSection from "../components/HeroSection";
import './events.css'; 
import './main.css'
import Sample from '../assets/sample.png';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from "react-router-dom";

export default function Events() {
    const [events, setEvents] = useState({
        upcomingEvents: [],
        completedEvents: [],
        cancelledEvents: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        AOS.init();
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/events?select=*`,
                {
                    headers: {
                        'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const data = await response.json();
            
            // Separate events based on their status
            const upcomingEvents = data.filter(event => 
                event.status === "Upcoming"
            );
            
            const completedEvents = data.filter(event => 
                event.status === "Completed"
            );
            
            const cancelledEvents = data.filter(event => 
                event.status === "Cancelled"
            );
            
            setEvents({
                upcomingEvents,
                completedEvents,
                cancelledEvents
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    // Function to calculate and format countdown
    const getCountdown = (eventDate) => {
        if (!eventDate) return 'Date not specified';
        
        const now = new Date();
        const event = new Date(eventDate);
        const diffTime = event - now;
        
        if (diffTime < 0) return 'Event has passed';
        
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (diffDays > 0) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
        } else {
            return 'Less than an hour';
        }
    };

    // Function to format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return 'Date not specified';
        
        try {
            const date = new Date(dateString);
            
            const dateOptions = { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            
            const timeOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            
            const formattedDate = date.toLocaleDateString('en-US', dateOptions);
            const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
            
            return `Registration Ends at ${formattedDate} - ${formattedTime}`;
        } catch (e) {
            return 'Invalid date format';
        }
    };

    // Function to create placeholder image if none exists
    const getImageUrl = (imageUrl) => {
        return imageUrl && imageUrl.trim() !== '' ? imageUrl : Sample;
    };

    // Function to strip HTML tags from description for preview
    const stripHtml = (html) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };

    // Function to render event cards
    const renderEventCards = (events) => {
        if (events.length === 0) {
            return (
                <div className="public-no-events">
                    <p>No events available at the moment. Check back soon!</p>
                </div>
            );
        }

        // Only display up to 2 events per row
        const displayEvents = events.slice(0, events.length);

        return (
            <div className="public-events-grid">
                {displayEvents.map(event => (
                    <div className="public-event-card" key={event.id} data-aos="fade-up">
                        <div className="public-event-image">
                            <img 
                                src={getImageUrl(event.image_url)} 
                                alt={`${event.heading} thumbnail`}
                                loading="lazy"
                            />
                        </div>
                        <div className="public-event-content">
                            <div>
                                <h3>{event.heading}</h3>
                                <p className="public-event-date">
                                    {formatDate(event.event_date)}
                                </p>
                            </div>
                            <p className="public-event-description">
                                {event.tagline || stripHtml(event.description).substring(0, window.innerWidth <= 480 ? 100 : 150)}
                                {!event.tagline && stripHtml(event.description).length > (window.innerWidth <= 480 ? 100 : 150) ? '...' : ''}
                            </p>
                            {event.rsvp_link && event.status === "Upcoming" && (
                                <a href={event.rsvp_link} className="public-rsvp-button" target="_blank" rel="noopener noreferrer">
                                    RSVP
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <title>Events</title>
            <NavigationBar />
            <main>
                <HeroSection title="Events" theme="events" />

                <section className="public-events-container">
                    {loading ? (
                        <div className="public-loading-container">
                            <div className="public-loading-spinner"></div>
                            <p>Loading events...</p>
                        </div>
                    ) : error ? (
                        <div className="public-error-container">
                            <p>Error loading events: {error}</p>
                            <button onClick={fetchEvents} className="public-retry-button">Retry</button>
                        </div>
                    ) : (
                        <>
                            {events.upcomingEvents.length > 0 && (
                                <div className="public-events-section">
                                    <h2>Ongoing Events</h2>
                                    {renderEventCards(events.upcomingEvents)}
                                </div>
                            )}
                            
                            {events.completedEvents.length > 0 && (
                                <div className="public-events-section">
                                    <h2>Completed Events</h2>
                                    {renderEventCards(events.completedEvents)}
                                </div>
                            )}
                            
                            {events.cancelledEvents.length > 0 && (
                                <div className="public-events-section">
                                    <h2>Cancelled Events</h2>
                                    {renderEventCards(events.cancelledEvents)}
                                </div>
                            )}
                            
                            {events.upcomingEvents.length === 0 && 
                             events.completedEvents.length === 0 && 
                             events.cancelledEvents.length === 0 && (
                                <div className="public-no-events-container">
                                    <p>No events available at the moment. Check back soon!</p>
                                </div>
                             )}
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}

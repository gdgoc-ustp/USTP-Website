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
        ongoingEvents: [],
        pastEvents: []
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
            
            // Separate events into ongoing and past
            const ongoingEvents = data.filter(event => 
                event.status === "Ongoing" || event.status === "Upcoming"
            );
            
            const pastEvents = data.filter(event => 
                event.status === "Past" || event.status === "Completed"
            );
            
            setEvents({
                ongoingEvents,
                pastEvents
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    // Function to format date nicely
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    // Function to create placeholder image if none exists
    const getImageUrl = (imageUrl) => {
        return imageUrl && imageUrl.trim() !== '' ? imageUrl : Sample;
    };

    // Function to strip HTML tags from description for preview
    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };

    // Function to render event cards
    const renderEventCards = (events) => {
        if (events.length === 0) {
            return (
                <div className="no-events">
                    <p>No events available at the moment. Check back soon!</p>
                </div>
            );
        }

        return (
            <div className="events-grid">
                {events.map(event => (
                    <div className="event-card" key={event.id}>
                        <div className="event-image">
                            <img 
                                src={getImageUrl(event.image_url)} 
                                alt={`${event.heading} thumbnail`}
                            />
                        </div>
                        <div className="event-content">
                            <h3>{event.heading}</h3>
                            <p className="event-time">
                                <span className="dot"></span> Registration closes at {formatDate(event.created_at)}
                            </p>
                            <p className="event-description">
                                {stripHtml(event.description).substring(0, 150)}
                                {stripHtml(event.description).length > 150 ? '...' : ''}
                            </p>
                            <button className="rsvp-button">RSVP</button>
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

                <section className="events-container">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading events...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <p>Error loading events: {error}</p>
                            <button onClick={fetchEvents} className="retry-button">Retry</button>
                        </div>
                    ) : (
                        <>
                            <div className="events-section">
                                <h2>Ongoing Events</h2>
                                {renderEventCards(events.ongoingEvents)}
                            </div>
                            
                            <div className="events-section">
                                <h2>Past Events</h2>
                                {renderEventCards(events.pastEvents)}
                            </div>
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}

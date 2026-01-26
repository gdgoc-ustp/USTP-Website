import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import HeroSection from "../components/HeroSection";
import './events.css';
import Sample from '../assets/sample.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Events() {
    const location = useLocation();
    const [events, setEvents] = useState({
        upcomingEvents: [],
        completedEvents: [],
        cancelledEvents: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        AOS.init();
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/events?select=*`,
                { headers: { 'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY, 'Content-Type': 'application/json' } }
            );

            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();

            setEvents({
                upcomingEvents: data.filter(e => e.status === "Upcoming"),
                completedEvents: data.filter(e => e.status === "Completed"),
                cancelledEvents: data.filter(e => e.status === "Cancelled")
            });

            // If no upcoming events, default to completed
            if (data.filter(e => e.status === "Upcoming").length === 0 && data.filter(e => e.status === "Completed").length > 0) {
                setActiveTab('completed');
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const formatDate = (dateString, timeOnly = false) => {
        if (!dateString) return 'TBA';
        const date = new Date(dateString);
        if (timeOnly) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getImageUrl = (url) => url && url.trim() !== '' ? url : Sample;
    const stripHtml = (html) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };

    const renderEventCards = (eventList, status) => {
        if (eventList.length === 0) {
            return (
                <div className="w-full text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                    <p className="text-xl text-gray-500 font-google-sans">No {status.toLowerCase()} events at the moment.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {eventList.map((event, index) => (
                    <div key={event.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-gray-100 h-full hover:-translate-y-2" data-aos="fade-up" data-aos-delay={index * 100}>
                        <div className="h-60 overflow-hidden relative">
                            <img
                                src={getImageUrl(event.image_url)}
                                alt={event.heading}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm text-green-700">
                                {event.status}
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-500">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">{formatDate(event.event_date)}</span>
                                {event.event_date && <span>• {formatDate(event.event_date, true)}</span>}
                            </div>

                            <h3 className="font-bold text-2xl text-gray-900 font-google-sans mb-3 line-clamp-2 leading-tight group-hover:text-green-600 transition-colors">
                                {event.heading}
                            </h3>

                            <p className="text-gray-600 mb-6 font-google-sans line-clamp-3 leading-relaxed flex-grow">
                                {event.tagline || stripHtml(event.description)}
                            </p>

                            <div className="mt-auto pt-6 border-t border-gray-100">
                                {status === "Upcoming" && event.rsvp_link ? (
                                    <a href={event.rsvp_link} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-green-200">
                                        RSVP Now
                                    </a>
                                ) : (
                                    <div className="text-gray-400 font-medium text-center py-2 flex items-center justify-center gap-2">
                                        <span>View Details</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div id="overhaul-v2-root">
            <title>Events</title>
            <NavigationBar />
            <main className="bg-gray-50 min-h-screen">
                <HeroSection title="Events" theme="events" previousPath={location.state?.from} />

                <section className="py-24 px-4 max-w-7xl mx-auto">
                    {/* Tabs */}
                    <div className="flex justify-center mb-16">
                        <div className="bg-white p-2 rounded-full shadow-sm border border-gray-200 inline-flex">
                            <button
                                onClick={() => setActiveTab('upcoming')}
                                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeTab === 'upcoming' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                Upcoming
                            </button>
                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeTab === 'completed' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                Past Events
                            </button>
                            {events.cancelledEvents.length > 0 && (
                                <button
                                    onClick={() => setActiveTab('cancelled')}
                                    className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${activeTab === 'cancelled' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    Cancelled
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center p-20">
                            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center max-w-2xl mx-auto">
                            <p className="font-bold mb-4">Oops! Error loading events.</p>
                            <button onClick={fetchEvents} className="underline hover:text-red-800">Try Again</button>
                        </div>
                    ) : (
                        <div className="min-h-[400px]">
                            {activeTab === 'upcoming' && (
                                <div data-aos="fade-in">
                                    <div className="text-center mb-12">
                                        <h2 className="text-4xl font-bold font-google-sans text-gray-900 mb-4">What's Happening</h2>
                                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Join us for our upcoming workshops, tech talks, and hackathons. Don't miss out!</p>
                                    </div>
                                    {renderEventCards(events.upcomingEvents, "Upcoming")}
                                </div>
                            )}

                            {activeTab === 'completed' && (
                                <div data-aos="fade-in">
                                    <div className="text-center mb-12">
                                        <h2 className="text-4xl font-bold font-google-sans text-gray-900 mb-4">Past Highlights</h2>
                                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Browse through our completed events and see what we've been up to.</p>
                                    </div>
                                    {renderEventCards(events.completedEvents, "Completed")}
                                </div>
                            )}

                            {activeTab === 'cancelled' && (
                                <div data-aos="fade-in">
                                    {renderEventCards(events.cancelledEvents, "Cancelled")}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}


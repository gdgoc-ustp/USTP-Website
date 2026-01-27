import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import "./eventDetails.css";
import Sample from '../assets/sample.png';
import { FiLink, FiArrowLeft, FiClock, FiCalendar, FiMapPin, FiExternalLink } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [readingProgress, setReadingProgress] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
        fetchEvent();
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current) {
                const element = contentRef.current;
                const windowHeight = window.innerHeight;
                const documentHeight = element.scrollHeight;
                const scrollTop = window.scrollY;
                const articleStart = element.offsetTop;

                const articleHeight = documentHeight - windowHeight;
                const scrollProgress = Math.max(0, scrollTop - articleStart);
                const progress = Math.min(100, (scrollProgress / articleHeight) * 100);

                setReadingProgress(progress);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [event]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/events?id=eq.${id}&select=*`,
                {
                    headers: {
                        "apikey": `${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error fetching event: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.length === 0) {
                throw new Error("Event not found");
            }

            setEvent(data[0]);
        } catch (err) {
            console.error("Error fetching event:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return Sample;
        return url;
    };

    const formatDate = (dateString, withTime = false) => {
        if (!dateString) return 'TBA';
        const options = withTime
            ? { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
            : { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const shareEvent = (platform) => {
        const url = window.location.href;
        const title = event?.heading || 'Join us for this event!';

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            copy: url
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard!');
            });
        } else {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    return (
        <div id="overhaul-v2-root">
            <title>{event ? event.heading : "Loading Event..."}</title>
            <NavigationBar />

            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-[9999]" style={{ display: readingProgress > 0 ? 'block' : 'none' }}>
                <div
                    className="h-full bg-green-600 transition-all duration-300 ease-out"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            <main className="event-details-main min-h-screen bg-gray-50 pt-48 pb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-google-sans">Loading event details...</p>
                    </div>
                ) : error ? (
                    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                        <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-red-100">
                            <h2 className="text-3xl font-bold text-red-600 mb-4 font-google-sans">Error Loading Event</h2>
                            <p className="text-gray-600 mb-8">{error}</p>
                            <Link to="/events" className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all">
                                <FiArrowLeft /> Return to Events
                            </Link>
                        </div>
                    </div>
                ) : event ? (
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-google-sans" data-aos="fade-up">
                            <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
                            <span>/</span>
                            <Link to="/events" className="hover:text-green-600 transition-colors">Events</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium truncate max-w-[200px]">{event.heading}</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Left Column: Image and Description */}
                            <div className="lg:col-span-2">
                                <header className="mb-8" data-aos="fade-up">
                                    <div className="flex gap-2 mb-4">
                                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${event.status === 'Upcoming' ? 'bg-green-100 text-green-700' :
                                            event.status === 'Completed' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-google-sans leading-tight">
                                        {event.heading}
                                    </h1>
                                    {event.tagline && (
                                        <p className="text-xl text-gray-600 font-medium leading-relaxed italic border-l-4 border-green-500 pl-6 mb-8">
                                            {event.tagline}
                                        </p>
                                    )}
                                </header>

                                <div className="rounded-[2.5rem] overflow-hidden shadow-xl mb-12" data-aos="fade-up">
                                    <img
                                        src={getImageUrl(event.image_url)}
                                        alt={event.heading}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-12" data-aos="fade-up">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-google-sans">About this event</h2>
                                    <div
                                        className="event-description-content text-lg text-gray-700 leading-relaxed font-google-sans"
                                        ref={contentRef}
                                        dangerouslySetInnerHTML={{ __html: event.description }}
                                    />
                                </div>

                                <div className="flex justify-center" data-aos="fade-up">
                                    <Link to="/events" className="group flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-full text-lg border-2 border-gray-100 hover:border-green-600 hover:text-green-600 transition-all shadow-sm hover:shadow-lg">
                                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                                        Back to Events
                                    </Link>
                                </div>
                            </div>

                            {/* Right Column: Event Info & RSVP */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-32 space-y-6">
                                    {/* Event Details Card */}
                                    <div className="bg-white rounded-[2rem] p-8 shadow-md border border-gray-100" data-aos="fade-left">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 font-google-sans border-b pb-4">Event Details</h3>

                                        <div className="space-y-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                                    <FiCalendar size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-bold uppercase mb-1">Date</p>
                                                    <p className="font-bold text-gray-900">{formatDate(event.event_date)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                                    <FiClock size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-bold uppercase mb-1">Time</p>
                                                    <p className="font-bold text-gray-900">{formatDate(event.event_date, true).split('at')[1] || 'TBA'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                                    <FiMapPin size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-bold uppercase mb-1">Location</p>
                                                    <p className="font-bold text-gray-900">Virtual or USTP Campus</p>
                                                </div>
                                            </div>
                                        </div>

                                        {event.status === 'Upcoming' && event.rsvp_link && (
                                            <div className="mt-10">
                                                <a
                                                    href={event.rsvp_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-100 group"
                                                >
                                                    RSVP Now
                                                    <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </a>
                                                <p className="text-center text-gray-400 text-xs mt-3">External registration required</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Share Card */}
                                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100" data-aos="fade-left" data-aos-delay="100">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 font-google-sans">Share Event</h3>
                                        <div className="flex gap-3">
                                            <button onClick={() => shareEvent('twitter')} className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-blue-50 transition-colors group">
                                                <FaTwitter size={20} className="text-gray-400 group-hover:text-blue-400" />
                                            </button>
                                            <button onClick={() => shareEvent('facebook')} className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-blue-900 transition-colors group">
                                                <FaFacebook size={20} className="text-gray-400 group-hover:text-white" />
                                            </button>
                                            <button onClick={() => shareEvent('linkedin')} className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-blue-700 transition-colors group">
                                                <FaLinkedin size={20} className="text-gray-400 group-hover:text-white" />
                                            </button>
                                            <button onClick={() => shareEvent('copy')} className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-200 transition-colors group">
                                                <FiLink size={20} className="text-gray-400 group-hover:text-gray-900" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>
            <Footer />
        </div>
    );
}

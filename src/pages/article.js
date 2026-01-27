import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import "./article.css";
import Sample from '../assets/sample.png';
import { FiLink, FiArrowLeft, FiClock, FiCalendar, FiUser } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Article() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [readingProgress, setReadingProgress] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
        fetchArticle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Reading progress tracking
    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current) {
                const element = contentRef.current;
                const windowHeight = window.innerHeight;
                const documentHeight = element.scrollHeight;
                const scrollTop = window.scrollY;
                const articleStart = element.offsetTop;

                // Calculate progress based on article content
                const articleHeight = documentHeight - windowHeight;
                const scrollProgress = Math.max(0, scrollTop - articleStart);
                const progress = Math.min(100, (scrollProgress / articleHeight) * 100);

                setReadingProgress(progress);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [article]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/blog_posts?id=eq.${id}&select=*`,
                {
                    headers: {
                        "apikey": `${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error fetching article: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.length === 0) {
                throw new Error("Article not found");
            }

            setArticle(data[0]);
        } catch (err) {
            console.error("Error fetching article:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to get proper image URL
    const getImageUrl = (url) => {
        if (!url) return Sample;
        if (url.startsWith('http')) return url;
        return `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/blog-images/${url}`;
    };

    // Function to format date nicely
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const estimateReadingTime = (content) => {
        if (!content) return 0;
        const wordsPerMinute = 200;
        const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML
        const wordCount = textContent.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    const shareArticle = (platform) => {
        const url = window.location.href;
        const title = article?.heading || 'Check out this article';

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
            <title>{article ? article.heading : "Loading Article..."}</title>
            <NavigationBar />

            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-[9999]" style={{ display: readingProgress > 0 ? 'block' : 'none' }}>
                <div
                    className="h-full bg-red-600 transition-all duration-300 ease-out"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            <main className="article-main-container min-h-screen bg-gray-50 pt-32 pb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-google-sans">Loading article...</p>
                    </div>
                ) : error ? (
                    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                        <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-red-100">
                            <h2 className="text-3xl font-bold text-red-600 mb-4 font-google-sans">Error Loading Article</h2>
                            <p className="text-gray-600 mb-8">{error}</p>
                            <Link to="/news" className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all">
                                <FiArrowLeft /> Return to News
                            </Link>
                        </div>
                    </div>
                ) : article ? (
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-google-sans" data-aos="fade-up">
                            <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
                            <span>/</span>
                            <Link to="/news" className="hover:text-red-600 transition-colors">News</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium truncate max-w-[200px]">{article.heading}</span>
                        </div>

                        {/* Article Header */}
                        <header className="mb-12" data-aos="fade-up" data-aos-delay="100">
                            {/* Tags/Categories if available */}
                            <div className="flex gap-2 mb-6">
                                <span className="px-4 py-1.5 bg-red-100 text-red-600 text-sm font-bold rounded-full uppercase tracking-wider">
                                    News
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 font-google-sans leading-tight">
                                {article.heading}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-gray-600 font-medium pb-8 border-b border-gray-200">
                                <div className="flex items-center gap-1">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <FiUser size={20} />
                                    </div>
                                    <span className="text-gray-900">{"admin"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FiCalendar className="text-red-500" />
                                    <span>{formatDate(article.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FiClock className="text-red-500" />
                                    <span>{estimateReadingTime(article.description)} min read</span>
                                </div>
                            </div>
                        </header>

                        {/* Article Image */}
                        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-lg mb-12 group" data-aos="fade-up" data-aos-delay="200">
                            <img
                                src={getImageUrl(article.image_url)}
                                alt={article.heading}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Optional: Add tagline overlay if needed, or keep clean */}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Social Share Sidebar (Desktop) */}
                            <div className="hidden lg:block lg:col-span-1">
                                <div className="sticky top-32 flex flex-col gap-4">
                                    <button onClick={() => shareArticle('twitter')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all shadow-sm hover:scale-110" style={{ backgroundColor: '#f3f4f6' }} title="Share on Twitter">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1DA1F2">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => shareArticle('facebook')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all shadow-sm hover:scale-110" style={{ backgroundColor: '#f3f4f6' }} title="Share on Facebook">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#4267B2">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => shareArticle('linkedin')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all shadow-sm hover:scale-110" style={{ backgroundColor: '#f3f4f6' }} title="Share on LinkedIn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0077B5">
                                            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.306c0-4.613 2.332-8.515 7.961-6.105v-1.559c-3.56-1.1-5.717-.03-7.993 1.953v-1.983z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => shareArticle('copy')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all shadow-sm hover:scale-110" style={{ backgroundColor: '#f3f4f6' }} title="Copy Link">
                                        <FiLink size={20} color="#374151" />
                                    </button>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-11">
                                <article className="article-body font-google-sans text-lg md:text-xl text-gray-800 leading-relaxed" ref={contentRef} data-aos="fade-up" data-aos-delay="300">
                                    {article.tagline && (
                                        <p className="text-xl md:text-2xl text-gray-500 font-medium mb-8 leading-relaxed italic border-l-4 border-red-500 pl-6">
                                            {article.tagline}
                                        </p>
                                    )}
                                    <div dangerouslySetInnerHTML={{ __html: article.description }} />
                                </article>

                                {/* Tags & Share (Mobile) */}
                                <div className="mt-16 pt-8 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4 lg:hidden">
                                            <span className="text-gray-500 font-bold">Share:</span>
                                            <div className="flex gap-3">
                                                <button onClick={() => shareArticle('twitter')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-colors" style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Share on Twitter">
                                                    <FaTwitter size={20} color="#1DA1F2" />
                                                </button>
                                                <button onClick={() => shareArticle('facebook')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-colors" style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Share on Facebook">
                                                    <FaFacebook size={20} color="#4267B2" />
                                                </button>
                                                <button onClick={() => shareArticle('linkedin')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-colors" style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Share on LinkedIn">
                                                    <FaLinkedin size={20} color="#0077B5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Footer */}
                                <div className="mt-32 flex justify-center" data-aos="fade-up">
                                    <Link to="/news" className="group flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-full text-lg border-2 border-gray-100 hover:border-red-600 hover:text-red-600 transition-all shadow-sm hover:shadow-lg">
                                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                                        Back to News
                                    </Link>
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
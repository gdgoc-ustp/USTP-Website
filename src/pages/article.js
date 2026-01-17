import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import "./article.css";
import Sample from '../assets/sample.png';

export default function Article() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [readingProgress, setReadingProgress] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        fetchArticle();
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
                // You could add a toast notification here
                alert('Link copied to clipboard!');
            });
        } else {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    return (
        <>
            <title>{article ? article.heading : "Loading Article..."}</title>
            <NavigationBar />

            {/* Reading Progress Bar */}
            <div className="reading-progress-container">
                <div
                    className="reading-progress-bar"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            <main className="article-page">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading article...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <h2>Error</h2>
                        <p>{error}</p>
                        <Link to="/news" className="back-button">
                            Return to News
                        </Link>
                    </div>
                ) : article ? (
                    <>
                        <div className="article-hero" style={{backgroundImage: `url(${getImageUrl(article.image_url)})`}}>
                            <div className="article-hero-overlay"></div>
                            <div className="article-hero-content">
                                <div className="article-breadcrumb">
                                    <Link to="/news" className="breadcrumb-link">News</Link>
                                    <span className="breadcrumb-separator">›</span>
                                    <span className="breadcrumb-current">Article</span>
                                </div>
                                <h1>{article.heading}</h1>
                                <div className="article-meta-info">
                                    <p className="article-date">{formatDate(article.created_at)}</p>
                                    <span className="meta-separator">•</span>
                                    <p className="reading-time">{estimateReadingTime(article.description)} min read</p>
                                    <span className="meta-separator">•</span>
                                    <p className="article-author">{article.author_id || "GDG USTP"}</p>
                                </div>
                                {article.tagline && <p className="article-tagline">{article.tagline}</p>}
                            </div>
                        </div>
                        
                        <div className="article-container">
                            <div className="article-content" ref={contentRef}>
                                {/* Social Share Buttons */}
                                <div className="article-share">
                                    <h3>Share this article</h3>
                                    <div className="share-buttons">
                                        <button onClick={() => shareArticle('twitter')} className="share-btn twitter" aria-label="Share on Twitter">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                            </svg>
                                        </button>
                                        <button onClick={() => shareArticle('facebook')} className="share-btn facebook" aria-label="Share on Facebook">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                        </button>
                                        <button onClick={() => shareArticle('linkedin')} className="share-btn linkedin" aria-label="Share on LinkedIn">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                        </button>
                                        <button onClick={() => shareArticle('copy')} className="share-btn copy" aria-label="Copy link">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="article-body" dangerouslySetInnerHTML={{ __html: article.description }} />
                                
                                <div className="article-meta">
                                    <div className="article-author">
                                        <h3>Author</h3>
                                        <p>{article.author_id || "Anonymous"}</p>
                                    </div>
                                    
                                    <div className="article-tags">
                                        <h3>Tags</h3>
                                        <div className="tags-container">
                                            {/* If you have tags, map them here */}
                                            <span className="tag">GDG</span>
                                            <span className="tag">USTP</span>
                                            <span className="tag">News</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="article-nav">
                                    <Link to="/news" className="back-button">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                                        </svg>
                                        Back to News
                                    </Link>

                                    <div className="article-actions">
                                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="scroll-top-btn" aria-label="Scroll to top">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M18 15l-6-6-6 6"/>
                                            </svg>
                                            Top
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </main>
            <Footer />
        </>
    );
} 
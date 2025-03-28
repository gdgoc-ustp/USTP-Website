import React, { useEffect, useState } from 'react';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import HeroSection from "../components/HeroSection";
import './news.css';
import './main.css';
import Sample from '../assets/sample.png';
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function News() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const postsPerPage = 10;

    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
        });
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async (pageNumber = 0) => {
        try {
            setLoading(true);
            setError(null);
            
            const offset = pageNumber * postsPerPage;
            
            const response = await fetch(
                `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/blog_posts?select=*&limit=${postsPerPage}&offset=${offset}&order=created_at.desc`,
                {
                    headers: {
                        "apikey": `${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error fetching blog posts: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.length < postsPerPage) {
                setHasMore(false);
            }

            // If this is the first page, replace the posts array
            // If it's a subsequent page, append to the existing array
            if (pageNumber === 0) {
                setBlogPosts(data);
            } else {
                setBlogPosts((prev) => [...prev, ...data]);
            }
        } catch (err) {
            console.error("Error fetching blog posts:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to create placeholder image if none exists
    const getImageUrl = (url) => {
        if (!url) return "/static/media/sample.991f8b4aef635ce434a5.png";
        if (url.startsWith('http')) return url;
        return `https://yrvykwljzajfkraytbgr.supabase.co/storage/v1/object/public/blog-images/${url}`;
    };

    // Function to format date nicely
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to strip HTML tags from description for preview
    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    const truncateText = (text, maxLength = 200) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBlogPosts(nextPage);
    };

    return (
        <>
            <title>News</title>
            <NavigationBar />
            <main>
                <HeroSection title="News" theme="news" />

                <section className="news-container">
                    <h2>What's New</h2>

                    <div className="blog-posts">
                        {blogPosts.length > 0 ? (
                            blogPosts.map((post, index) => (
                                <div key={post.id} className="blog-post" data-aos="fade-up" data-aos-delay={index * 100}>
                                    <div className="post-image">
                                        <img 
                                            src={getImageUrl(post.image_url)} 
                                            alt={post.heading} 
                                        />
                                    </div>
                                    <div className="post-content">
                                        <h3>{post.heading}</h3>
                                        <p className="post-date">{formatDate(post.created_at)}</p>
                                        <p className="post-description">
                                            {post.tagline || truncateText(stripHtml(post.description))}
                                        </p>
                                        <Link to={`/news/article/${post.id}`} className="read-button">
                                            Read
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : !loading && !error ? (
                            <div className="no-posts">
                                <p>No blog posts found. Check back soon for updates!</p>
                            </div>
                        ) : null}
                        
                        {loading && (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Loading posts...</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="error-container">
                                <p>Error: {error}</p>
                                <button onClick={fetchBlogPosts} className="retry-button">
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {hasMore && blogPosts.length > 0 && !loading && (
                        <div className="load-more-container">
                            <button 
                                onClick={loadMore} 
                                className="load-more-button"
                                disabled={loading}
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}

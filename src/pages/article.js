import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import "./article.css";

export default function Article() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticle();
    }, [id]);

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
        if (!url) return "/static/media/sample.991f8b4aef635ce434a5.png";
        if (url.startsWith('http')) return url;
        return `https://yrvykwljzajfkraytbgr.supabase.co/storage/v1/object/public/blog-images/${url}`;
    };

    // Function to format date nicely
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <title>{article ? article.heading : "Loading Article..."}</title>
            <NavigationBar />
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
                            <div className="article-hero-content">
                                <h1>{article.heading}</h1>
                                <p className="article-date">{formatDate(article.created_at)}</p>
                                {article.tagline && <p className="article-tagline">{article.tagline}</p>}
                            </div>
                        </div>
                        
                        <div className="article-container">
                            <div className="article-content">
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
                                            <span className="tag">GDSC</span>
                                            <span className="tag">USTP</span>
                                            <span className="tag">News</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="article-nav">
                                    <Link to="/news" className="back-button">
                                        Back to News
                                    </Link>
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
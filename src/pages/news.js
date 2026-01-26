import React, { useEffect, useState, useMemo, useRef } from 'react';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import HeroSection from "../components/HeroSection";
import './news.css';
import Sample from '../assets/sample.png';
import { Link, useLocation } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function News() {
    const location = useLocation();
    const contentRef = useRef(null);

    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const postsPerPage = 10;

    useEffect(() => {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async (pageNumber = 0) => {
        try {
            setLoading(true);
            setError(null);
            const offset = pageNumber * postsPerPage;
            const response = await fetch(
                `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/blog_posts?select=*&limit=${postsPerPage}&offset=${offset}&order=created_at.desc`,
                { headers: { "apikey": `${process.env.REACT_APP_SUPABASE_ANON_KEY}`, "Content-Type": "application/json" } }
            );

            if (!response.ok) throw new Error(`Error fetching blog posts: ${response.statusText}`);

            const data = await response.json();
            if (data.length < postsPerPage) setHasMore(false);

            if (pageNumber === 0) setBlogPosts(data);
            else setBlogPosts((prev) => [...prev, ...data]);
        } catch (err) {
            console.error("Error fetching blog posts:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return Sample;
        if (url.startsWith('http')) return url;
        return `https://yrvykwljzajfkraytbgr.supabase.co/storage/v1/object/public/blog-images/${url}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    };

    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBlogPosts(nextPage);
    };

    const filteredAndSortedPosts = useMemo(() => {
        let filtered = blogPosts.filter(post =>
            post.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.tagline && post.tagline.toLowerCase().includes(searchTerm.toLowerCase())) ||
            stripHtml(post.description).toLowerCase().includes(searchTerm.toLowerCase())
        );

        switch (sortBy) {
            case 'oldest': return filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            case 'alphabetical': return filtered.sort((a, b) => a.heading.localeCompare(b.heading));
            default: return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
    }, [blogPosts, searchTerm, sortBy]);


    return (
        <div id="overhaul-v2-root">
            <title>News</title>
            <NavigationBar />
            <main className="bg-gray-50 min-h-screen">
                <HeroSection title="News" theme="news" previousPath={location.state?.from} />

                <section className="py-24 px-4 max-w-7xl mx-auto" ref={contentRef} data-aos="fade-up">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                        <h2 className="text-4xl md:text-5xl font-bold font-google-sans text-gray-900">Latest Updates</h2>

                        <div className="flex gap-4 w-full md:w-auto">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-6 py-3 rounded-full border border-gray-200 bg-white font-google-sans text-gray-700 outline-none focus:ring-2 focus:ring-red-500">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="alphabetical">A-Z</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-6 py-3 rounded-full border border-gray-200 bg-white font-google-sans w-full md:w-64 outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center p-20">
                            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredAndSortedPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredAndSortedPosts.map((post, index) => {
                                const isFeatured = index === 0 && !searchTerm;
                                return (
                                    <div key={post.id}
                                        className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-gray-100 ${isFeatured ? 'lg:col-span-2 lg:flex-row lg:items-center p-0' : 'flex-col'}`}
                                        data-aos="fade-up" data-aos-delay={index * 100}
                                    >
                                        <div className={`overflow-hidden relative ${isFeatured ? 'h-full w-full lg:w-1/2 min-h-[400px]' : 'h-64'}`}>
                                            <img
                                                src={getImageUrl(post.image_url)}
                                                alt={post.heading}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                        </div>

                                        <div className={`p-8 flex flex-col ${isFeatured ? 'w-full lg:w-1/2 justify-center py-12 px-10' : 'flex-grow'}`}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                                    News
                                                </span>
                                                <span className="text-gray-400 text-sm font-medium">{formatDate(post.created_at)}</span>
                                            </div>

                                            <h3 className={`font-bold text-gray-900 font-google-sans mb-4 group-hover:text-red-600 transition-colors ${isFeatured ? 'text-3xl md:text-4xl leading-tight' : 'text-xl md:text-2xl line-clamp-2'}`}>
                                                {post.heading}
                                            </h3>

                                            <p className={`text-gray-600 mb-6 font-google-sans leading-relaxed ${isFeatured ? 'text-lg line-clamp-4' : 'text-base line-clamp-3'}`}>
                                                {post.tagline || stripHtml(post.description)}
                                            </p>

                                            <div className="mt-auto">
                                                <Link to={`/news/article/${post.id}`} className="inline-flex items-center text-red-600 font-bold hover:gap-2 transition-all">
                                                    Read Article <span className="ml-1 text-xl">→</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
                            <p className="text-gray-500">Try adjusting your search terms.</p>
                            <button onClick={() => setSearchTerm('')} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition">Clear Search</button>
                        </div>
                    )}

                    {hasMore && !loading && !searchTerm && (
                        <div className="flex justify-center mt-16">
                            <button onClick={loadMore} className="px-8 py-4 bg-white border-2 border-red-500 text-red-600 font-bold rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-lg">
                                Load More Articles
                            </button>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}

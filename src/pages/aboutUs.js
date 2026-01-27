import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { LuSettings, LuCpu, LuMegaphone, LuUsers } from "react-icons/lu";
import { useLocation } from 'react-router-dom';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import HeroSection from "../components/HeroSection";
import { Link } from "react-router-dom";
import sampleImage1 from '../assets/sample.png';
import sampleImage2 from '../assets/sample.png';
import { getFeaturedMembers, getGroupColor } from '../data/team';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './aboutUs.css';


// Unifed Hero Card Component
// Improved with alternating layout support and richer visual hierarchy
const HeroCard = ({ title, description, image, theme = "light", reverse = false }) => (
    <div className="py-12 px-6">
        <div className={`max-w-7xl mx-auto rounded-[3rem] overflow-hidden shadow-lg border border-gray-100 ${theme === 'light' ? 'bg-white' : 'bg-gray-50'} group hover:shadow-2xl transition-all duration-500`}>
            <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center`}>
                <div className="w-full lg:w-1/2 p-8 md:p-20 flex flex-col justify-center gap-8">
                    <div className="flex flex-col gap-4">
                        <span className={`text-sm font-bold tracking-widest uppercase ${reverse ? 'text-red-500' : 'text-blue-600'}`}>
                            {reverse ? 'Our Mission' : 'Who We Are'}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold font-google-sans leading-tight text-gray-900">
                            {title}
                        </h2>
                    </div>
                    <p className="text-xl text-gray-600 leading-relaxed font-google-sans font-light">
                        {description}
                    </p>
                    {/* Decorative Element */}
                    <div className={`w-24 h-2 rounded-full mt-4 ${reverse ? 'bg-red-500' : 'bg-blue-600'}`}></div>
                </div>
                <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] relative overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${reverse ? 'from-red-900/40' : 'from-blue-900/40'} to-transparent opacity-60`}></div>
                </div>
            </div>
        </div>
    </div>
);

// ... (RoadmapItem component remains unchanged) ...
// Note: In a real scenario I would not remove the code unless I am rewriting it, 
// but for the tool I need to match the replacement block precisely or replace the whole file content block I choose.
// I will include RoadmapItem briefly or assume the user wants me to replace the bottom part primarily if I target it.
// Actually, I can just replace the definition of HeroCard and the main AboutUs body content.

const RoadmapItem = ({ year, title, description, image, index, label }) => {
    const isEven = index % 2 === 0;

    // google brand colors for the nodes
    const colors = ["bg-blue-600", "bg-red-600", "bg-yellow-600", "bg-green-600"];
    const nodeColor = colors[index % colors.length];

    return (
        <div className={`flex flex-col md:flex-row items-center justify-center w-full mb-32 relative z-10`}>

            {/* left side */}
            <div className={`w-full md:w-[45%] flex justify-end px-6 ${isEven ? 'order-2 md:order-1' : 'order-2 md:order-3 md:justify-start'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-10% 0px" }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className={`w-full max-w-xl bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative group transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]`}
                >
                    {/* floating label badge */}
                    <div className={`absolute top-6 right-8 ${isEven ? 'md:left-8 md:right-auto' : ''}`}>
                        <span className={`inline-block px-4 py-1.5 rounded-full ${nodeColor.replace('bg-', 'bg-').replace('600', '50')} ${nodeColor.replace('bg-', 'text-')} text-xs font-bold tracking-widest uppercase`}>
                            {label}
                        </span>
                    </div>

                    {/* content container */}
                    <div className="mt-8">
                        <div className="h-64 w-full rounded-2xl overflow-hidden mb-8 relative bg-gray-50 border border-gray-100">
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>

                        <h3 className="text-3xl font-bold font-google-sans text-gray-900 mb-4 leading-tight">
                            {title}
                        </h3>

                        <p className="text-gray-500 text-lg font-google-sans leading-relaxed">
                            {description}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* center node (spine marker) */}
            <div className={`order-1 md:order-2 flex-shrink-0 relative z-20 mb-8 md:mb-0`}>
                <div className="relative flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ margin: "-10% 0px" }}
                        className={`w-8 h-8 rounded-full bg-white ring-2 ring-gray-100 shadow-sm z-20 flex items-center justify-center`}
                    >
                        <div className={`w-4 h-4 rounded-full ${nodeColor} shadow-inner`}></div>
                    </motion.div>
                </div>
            </div>

            {/* right side spacer */}
            <div className={`w-full md:w-[45%] hidden md:block ${isEven ? 'order-3' : 'order-1'}`}></div>
        </div>
    );
}

export default function AboutUs() {
    const location = useLocation();
    const featuredMembers = getFeaturedMembers(3);

    const journeyContainerRef = useRef(null);

    // progress tracking for the whole roadmap
    const { scrollYProgress } = useScroll({
        target: journeyContainerRef,
        offset: ["start 80%", "end 20%"] // fill gradually across the whole scroll range
    });

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    // Smooth drawing of the line
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div id="overhaul-v2-root" >
            <title>About Us</title>
            <NavigationBar />

            <main className="bg-gray-50 min-h-screen">
                <HeroSection title="About Us" theme="aboutus" previousPath={location.state?.from} />

                {/* 1. Who We Are - Clean Unified Cards with Alternating Layout */}
                <section className="py-12 flex flex-col gap-12">
                    <HeroCard
                        title="Fostering Innovation"
                        description="Google Developer Groups (GDG) is a community of passionate developers interested in Google's developer technologies. We help developers grow their skills and build innovative solutions through hands-on workshops and real-world projects."
                        image={sampleImage1}
                        theme="light"
                    />
                    <HeroCard
                        title="Building Community"
                        description="Our mission is to create a vibrant ecosystem where developers can connect, learn, and collaborate. We believe in the power of community-led learning, fostering an inclusive environment for everyone to thrive in technology."
                        image={sampleImage2}
                        theme="light"
                        reverse={true}
                    />
                </section>

                <section ref={journeyContainerRef} className="py-24 px-4 bg-white relative overflow-hidden roadmap-container">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 z-0 opacity-[0.03]"
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    ></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-32">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 font-bold text-xs tracking-widest uppercase mb-4 border border-blue-100">Our Timeline</span>
                                <h2 className="text-4xl md:text-6xl font-bold font-google-sans text-gray-900 mb-6">Milestones</h2>
                                <p className="text-gray-500 text-xl max-w-2xl mx-auto">The launch and growth of our chapter.</p>
                            </motion.div>
                        </div>

                        <div className="relative">
                            {/* SVG Connector Path for perfectly smooth connections */}

                            {/* SVG Connector Path for perfectly smooth connections */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-full -translate-x-1/2 h-full z-0 overflow-visible pointer-events-none">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <motion.path
                                        d="M 50 0 L 50 100"
                                        stroke="#f3f4f6"
                                        strokeWidth="4"
                                        vectorEffect="non-scaling-stroke"
                                        fill="none"
                                    />
                                    <motion.path
                                        d="M 50 0 L 50 100"
                                        stroke="url(#gradient-line)"
                                        strokeWidth="4"
                                        vectorEffect="non-scaling-stroke"
                                        className="roadmap-line"
                                        fill="none"
                                        style={{ pathLength: scaleY }}
                                    />
                                    <defs>
                                        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#ef4444" />
                                            <stop offset="50%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#f59e0b" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            <div className="flex flex-col">
                                <RoadmapItem
                                    index={0}
                                    label="2020"
                                    title="Planting the Seed"
                                    description="GDG started as a small initiative founded by Hannah Mae Hormiguera to bring Google technologies to campus."
                                    image={sampleImage1}
                                />
                                <RoadmapItem
                                    index={1}
                                    label="2020 - 2023"
                                    title="Building Momentum"
                                    description="We expanded our reach, hosting our first major hackathon and establishing partnerships with local tech companies."
                                    image={sampleImage1}
                                />
                                <RoadmapItem
                                    index={2}
                                    label="2024 - Today"
                                    title="A Thriving Ecosystem"
                                    description="Now, we continue to foster innovation with regular workshops on AI, Cloud, and Mobile development."
                                    image={sampleImage2}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Departments - Moved Before Team */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold font-google-sans text-gray-900 mb-4" data-aos="fade-up">Our Departments</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Operations", desc: "Logistics & Planning", color: "bg-blue-50 text-blue-600", icon: <LuSettings className="w-10 h-10" /> },
                                { title: "Technology", desc: "Innovation & Workshops", color: "bg-red-50 text-red-600", icon: <LuCpu className="w-10 h-10" /> },
                                { title: "Communications", desc: "Media & Outreach", color: "bg-yellow-50 text-yellow-600", icon: <LuMegaphone className="w-10 h-10" /> },
                                { title: "Community", desc: "Partnerships & Growth", color: "bg-green-50 text-green-600", icon: <LuUsers className="w-10 h-10" /> }
                            ].map((dept, idx) => (
                                <div key={idx} className="group p-10 rounded-[2.5rem] bg-gray-50 border border-transparent hover:bg-white hover:shadow-2xl hover:border-gray-100 transition-all duration-300 hover:-translate-y-2 text-center flex flex-col items-center" data-aos="fade-up" data-aos-delay={idx * 100}>
                                    <div className={`w-20 h-20 rounded-3xl ${dept.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm`}>
                                        {dept.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold font-google-sans text-gray-900 mb-3">{dept.title}</h3>
                                    <p className="text-gray-500 font-google-sans leading-relaxed">{dept.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Meet The Team - Redesigned CTA */}
                <section className="py-24 px-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold font-google-sans text-gray-900 mb-4" data-aos="fade-up">Meet The Team</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">The people making it all happen.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center mb-20">
                            {featuredMembers.map((member, index) => {
                                const groupColor = getGroupColor(member.group);
                                return (
                                    <div key={member.id} className="w-full max-w-sm rounded-[2rem] overflow-hidden shadow-lg bg-white flex flex-col group transition-all duration-300 hover:-translate-y-2" data-aos="fade-up" data-aos-delay={index * 100}>
                                        <div className="h-80 w-full relative overflow-hidden bg-gray-200">
                                            <img
                                                src={encodeURI(member.image)}
                                                alt={member.name}
                                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <div className="p-8 relative">
                                            <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: groupColor }}></div>
                                            <h3 className="text-2xl font-bold text-gray-900 font-google-sans mb-1">{member.name}</h3>
                                            <p className="text-gray-500 font-medium font-google-sans">{member.role}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Redesigned View Team CTA - Full Width Card */}
                        <div className="max-w-4xl mx-auto" data-aos="zoom-in">
                            <Link to="/team" className="block group relative overflow-hidden rounded-[2.5rem] bg-gray-900 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                                {/* Decorative Blobs */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400 opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>

                                <div className="relative px-8 py-12 md:py-16 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-3xl md:text-4xl font-bold font-google-sans mb-2">Want to see everyone?</h3>
                                        <p className="text-blue-100 text-lg">Explore the full roster of our talented team members.</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-full text-lg shadow-lg group-hover:shadow-xl transition-all group-hover:bg-gray-50 group-hover:scale-105">
                                            View All Members
                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </main >
            <Footer />
        </div >
    );
}
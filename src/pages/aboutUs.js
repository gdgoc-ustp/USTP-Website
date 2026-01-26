import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { LuSettings, LuCpu, LuMegaphone, LuUsers } from "react-icons/lu";
import { useLocation } from 'react-router-dom';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import HeroSection from "../components/HeroSection";
import { Link } from "react-router-dom";
import storyImage from '../assets/story.png';
import sampleImage1 from '../assets/sample.png';
import sampleImage2 from '../assets/sample.png';
import { getFeaturedMembers, getGroupColor } from '../data/team';

// Unifed Hero Card Component
// A clean, high-impact card that combines text and image in a unified block, rather than alternating separate sections
const HeroCard = ({ title, description, image, theme = "light" }) => (
    <div className="py-8 px-6">
        <div className={`max-w-7xl mx-auto rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 ${theme === 'light' ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center gap-6">
                    <span className="text-sm font-bold tracking-widest uppercase text-blue-600">About Us</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-google-sans leading-tight text-gray-900">
                        {title}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed font-google-sans">
                        {description}
                    </p>
                </div>
                <div className="w-full lg:w-1/2 h-[300px] lg:h-auto min-h-[400px] relative">
                    <img
                        src={image}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    </div>
);

// Roadmap Item Component - Material Design Style
const RoadmapItem = ({ year, title, description, image, index, label }) => {
    const isEven = index % 2 === 0;

    // Google Brand Colors for the nodes
    const colors = ["bg-blue-600", "bg-red-600", "bg-yellow-600", "bg-green-600"];
    const nodeColor = colors[index % colors.length];

    return (
        <div className={`flex flex-col md:flex-row items-center justify-center w-full mb-24 relative z-10`}>
            {/* Desktop Connector Line */}
            <div className={`hidden md:block absolute top-[50%] h-0.5 w-[45%] bg-gray-200 -z-10 ${isEven ? 'right-[50%] origin-right' : 'left-[50%] origin-left'}`}></div>

            {/* Left Side */}
            <div className={`w-full md:w-[45%] flex justify-end px-6 ${isEven ? 'order-2 md:order-1' : 'order-2 md:order-3 md:justify-start'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    whileHover={{ y: -5 }}
                    className={`w-full max-w-xl bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 relative group transition-all duration-300 hover:shadow-xl`}
                >
                    {/* Floating Label Badge */}
                    <div className={`absolute top-6 right-6 ${isEven ? 'md:left-6 md:right-auto' : ''}`}>
                        <span className={`inline-block px-4 py-1.5 rounded-full ${nodeColor.replace('bg-', 'bg-').replace('600', '50')} ${nodeColor.replace('bg-', 'text-')} text-xs font-bold tracking-wider uppercase`}>
                            {label}
                        </span>
                    </div>

                    {/* Content Container */}
                    <div className="mt-8">
                        {/* Image Header */}
                        <div className="h-56 w-full rounded-2xl overflow-hidden mb-6 relative bg-gray-100">
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        <h3 className="text-2xl font-bold font-google-sans text-gray-900 mb-3 leading-tight">
                            {title}
                        </h3>

                        <p className="text-gray-600 font-medium font-google-sans leading-relaxed">
                            {description}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Center Node (Spine Marker) - Clean Colored Dot */}
            <div className={`order-1 md:order-2 flex-shrink-0 relative z-20 mb-8 md:mb-0`}>
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                    className={`w-5 h-5 rounded-full ${nodeColor} ring-4 ring-white shadow-md z-20 relative`}
                ></motion.div>
            </div>

            {/* Right Side Spacer */}
            <div className={`w-full md:w-[45%] hidden md:block ${isEven ? 'order-3' : 'order-1'}`}></div>
        </div>
    );
}

export default function AboutUs() {
    const location = useLocation();
    const featuredMembers = getFeaturedMembers(3);

    const journeyContainerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: journeyContainerRef,
        offset: ["start center", "end center"]
    });

    // Smooth drawing of the line
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <>
            <title>About Us</title>
            <NavigationBar />

            <main className="bg-gray-50 min-h-screen">
                <HeroSection title="About Us" theme="aboutus" previousPath={location.state?.from} />

                {/* 1. Who We Are - Clean Unified Cards */}
                <section className="py-12">
                    <HeroCard
                        title="Fostering Innovation"
                        description="Google Developer Groups (GDG) is a community of passionate developers interested in Google's developer technologies. We help developers grow their skills and build innovative solutions."
                        image={sampleImage1}
                        theme="light"
                    />
                    <HeroCard
                        title="Building Community"
                        description="Our mission is to create a vibrant ecosystem where developers can connect, learn, and collaborate. We believe in the power of community-led learning through tech talks and workshops."
                        image={sampleImage2}
                        theme="light"
                    />
                </section>

                {/* 2. History - Roadmap Style */}
                <section ref={journeyContainerRef} className="py-24 px-4 bg-white relative overflow-hidden">
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
                                <h2 className="text-4xl md:text-6xl font-bold font-google-sans text-gray-900 mb-6">Roadmap</h2>
                                <p className="text-gray-500 text-xl max-w-2xl mx-auto">From humble beginnings to a campus revolution. Here is how we did it.</p>
                            </motion.div>
                        </div>

                        <div className="relative">
                            {/* Animated Center Line (Desktop) */}
                            <div className="hidden md:block absolute left-1/2 top-4 bottom-12 w-1 bg-gray-100 transform -translate-x-1/2 rounded-full"></div>
                            <motion.div
                                style={{ scaleY }}
                                className="hidden md:block absolute left-1/2 top-4 bottom-12 w-1 bg-gradient-to-b from-red-500 to-red-600 transform -translate-x-1/2 origin-top rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] z-0"
                            ></motion.div>

                            <div className="flex flex-col">
                                <RoadmapItem
                                    index={0}
                                    label="The Beginning"
                                    title="Planting the Seed (2020)"
                                    description="GDG started as a small initiative founded by Hannah Mae Hormiguera to bring Google technologies to campus."
                                    image={storyImage}
                                />
                                <RoadmapItem
                                    index={1}
                                    label="Growth Phase"
                                    title="Building Momentum (2020 - 2023)"
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

                {/* 4. Meet The Team - Moved After Departments */}
                <section className="py-24 px-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold font-google-sans text-gray-900 mb-4" data-aos="fade-up">Meet The Team</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">The people making it all happen.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center mb-16">
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

                        <div className="text-center">
                            <Link to="/team" className="inline-flex items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-xl">
                                View Full Team
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </Link>
                        </div>
                    </div>
                </section>
            </main >
            <Footer />
        </>
    );
}
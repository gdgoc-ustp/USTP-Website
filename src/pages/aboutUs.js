import React, { useEffect, useState } from 'react';
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

// Image Timeline Item
const TimelineItem = ({ year, title, description, image, isLast }) => (
    <div className="relative pl-8 md:pl-0 md:w-1/2 md:ml-auto pr-0 md:pr-12 md:odd:ml-0 md:odd:mr-auto md:odd:pl-12 md:odd:text-right group" data-aos="fade-up">
        {/* Dot */}
        <div className="absolute left-0 top-8 md:left-auto md:right-[-9px] md:group-odd:right-auto md:group-odd:left-[-9px] w-5 h-5 rounded-full bg-red-500 border-4 border-white shadow-md z-10"></div>
        {/* Line */}
        {!isLast && (
            <div className="absolute left-[9px] top-12 bottom-[-60px] md:left-auto md:right-0 md:group-odd:right-auto md:group-odd:left-0 w-0.5 bg-gray-200"></div>
        )}

        <div className="mb-16">
            <div className="mb-6 overflow-hidden rounded-[2rem] shadow-md h-48 md:h-64 w-full">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            <span className="inline-block px-4 py-1 rounded-full bg-red-50 text-red-600 font-bold text-sm mb-3">
                {year}
            </span>
            <h3 className="text-2xl font-bold text-gray-900 font-google-sans mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed font-google-sans">
                {description}
            </p>
        </div>
    </div>
);


export default function AboutUs() {
    const location = useLocation();
    const featuredMembers = getFeaturedMembers(3);

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
                        theme="light" // Kept light to avoid the "dark block" issue
                    />
                </section>

                {/* 2. History - w/ Images */}
                <section className="py-24 px-6 bg-white relative overflow-hidden">
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold font-google-sans text-gray-900 mb-6" data-aos="fade-up">Our Journey</h2>
                        </div>

                        <div className="relative">
                            <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

                            <TimelineItem
                                year="The Beginning"
                                title="Planting the Seed"
                                description="GDG started as a small initiative to bring Google technologies to campus. It began with just a few students gathering to watch keynotes."
                                image={storyImage}
                            />
                            <TimelineItem
                                year="Growth Phase"
                                title="Building Momentum"
                                description="We expanded our reach, hosting our first major hackathon and establishing partnerships with local tech companies."
                                image={sampleImage1}
                            />
                            <TimelineItem
                                year="Today"
                                title="A Thriving Ecosystem"
                                description="Now, we continue to foster innovation with regular workshops on AI, Cloud, and Mobile development."
                                image={sampleImage2}
                                isLast={true}
                            />
                        </div>
                    </div>
                </section>

                {/* 3. Meet The Team (Restored) */}
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

                {/* 4. Departments - Corrected Colors */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold font-google-sans text-gray-900 mb-4" data-aos="fade-up">Our Departments</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Operations", desc: "Logistics & Planning", color: "bg-blue-50 text-blue-600" },
                                { title: "Technology", desc: "Innovation & Workshops", color: "bg-red-50 text-red-600" }, /* Fixed: Red */
                                { title: "Communications", desc: "Media & Outreach", color: "bg-yellow-50 text-yellow-600" },
                                { title: "Community", desc: "Partnerships & Growth", color: "bg-green-50 text-green-600" } /* Fixed: Green */
                            ].map((dept, idx) => (
                                <div key={idx} className="group p-10 rounded-[2.5rem] bg-gray-50 border border-transparent hover:bg-white hover:shadow-2xl hover:border-gray-100 transition-all duration-300 hover:-translate-y-2 text-center flex flex-col items-center" data-aos="fade-up" data-aos-delay={idx * 100}>
                                    <div className={`w-20 h-20 rounded-3xl ${dept.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm`}>
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold font-google-sans text-gray-900 mb-3">{dept.title}</h3>
                                    <p className="text-gray-500 font-google-sans leading-relaxed">{dept.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
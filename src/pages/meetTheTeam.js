import { useState, useRef } from 'react';
import NavigationBar from '../components/navBar';
import Footer from '../components/footer';
import HeroSection from '../components/HeroSection';
import { getTeamByGroup, getAllGroups, getGroupColor } from '../data/team';
import './meetTheTeam.css';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

export default function MeetTheTeam() {
    const [searchQuery, setSearchQuery] = useState('');

    // Get all data
    const allGroups = getAllGroups();
    const teamByGroup = getTeamByGroup();

    // Filter logic only for search (if search is active, we might fallback to grid or filter the sliders)
    // For a slider design, search usually isolates cards. Let's keep search but if searching, show a grid results view.
    // If no search, show the sliders.

    const isSearching = searchQuery.trim().length > 0;

    const filteredSearchResults = Object.values(teamByGroup).flat().filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div id="overhaul-v2-root">
            <title>Meet the Team</title>
            <NavigationBar />

            <HeroSection title="Meet The Team" theme="aboutus" />

            <main className="bg-gray-50 min-h-screen pb-24">
                {/* Search Header */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="relative max-w-xl mx-auto">
                        <input
                            type="text"
                            className="w-full pl-6 pr-12 py-4 rounded-full border-2 border-transparent bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:shadow-lg transition-all text-lg font-google-sans"
                            placeholder="Find a team member..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                </div>

                {isSearching ? (
                    // Search Results Grid
                    <div className="max-w-7xl mx-auto px-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 font-google-sans">
                            {filteredSearchResults.length > 0 ? `Found ${filteredSearchResults.length} members` : 'No members found'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredSearchResults.map(member => (
                                <TeamCard key={member.id} member={member} />
                            ))}
                        </div>
                    </div>
                ) : (
                    // Section Sliders
                    <div className="flex flex-col gap-20">
                        {allGroups.map((group) => {
                            const members = teamByGroup[group] || [];
                            if (members.length === 0) return null;
                            const groupColor = getGroupColor(group);

                            return (
                                <TeamSectionSlider
                                    key={group}
                                    title={group}
                                    members={members}
                                    color={groupColor}
                                />
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

// Individual Section Slider Component
function TeamSectionSlider({ title, members, color }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 400; // Approx one card width + gap
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full relative group/section">
            <div className="max-w-7xl mx-auto px-6 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-10 rounded-full" style={{ backgroundColor: color }}></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-google-sans">{title}</h2>
                    <span className="text-sm font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{members.length}</span>
                </div>

                {/* Navigation Buttons (Desktop) */}
                <div className="hidden md:flex gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100 z-10"
                        aria-label={`Scroll ${title} left`}
                    >
                        <FiChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100 z-10"
                        aria-label={`Scroll ${title} right`}
                    >
                        <FiChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Slider Container - Full Width with Padding for Center content */}
            <div
                ref={scrollRef}
                className="overflow-x-auto hide-scrollbar pb-12 pt-4 px-6 md:px-[max(1.5rem,calc((100vw-80rem)/2))]"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                <div className="flex gap-6 w-max">
                    {members.map((member) => (
                        <div key={member.id} className="snap-center">
                            <TeamCard member={member} />
                        </div>
                    ))}
                    {/* Padding right spacer */}
                    <div className="w-6 shrink-0"></div>
                </div>
            </div>
        </div>
    );
}

// Reusable Card Component
function TeamCard({ member }) {
    const groupColor = getGroupColor(member.group);

    return (
        <div className="w-[300px] md:w-[340px] h-[450px] bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group relative flex flex-col">
            {/* Image Container */}
            <div className="h-[75%] w-full relative overflow-hidden bg-gray-100">
                <img
                    src={encodeURI(member.image)}
                    alt={member.alt}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-white rounded-t-[2rem] translate-y-2 group-hover:translate-y-0 transition-transform duration-300 h-[30%] flex flex-col justify-center shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                {/* Color Pill */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full" style={{ backgroundColor: groupColor }}></div>

                <h3 className="text-xl font-bold text-gray-900 font-google-sans leading-tight mb-1 line-clamp-1" title={member.name}>
                    {member.name}
                </h3>
                <p className="text-sm font-medium text-gray-500 font-google-sans line-clamp-2" title={member.role}>
                    {member.role}
                </p>

                {/* Hover Reveal: Group Badge */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span
                        className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-gray-100 text-gray-600"
                    >
                        {member.group}
                    </span>
                </div>
            </div>
        </div>
    );
}

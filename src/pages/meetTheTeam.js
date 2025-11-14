import { useState, useMemo } from 'react';
import NavigationBar from '../components/navBar';
import Footer from '../components/footer';
import HeroSection from '../components/HeroSection';
import { teamMembers, getTeamByGroup, getAllGroups, getGroupColor } from '../data/team';
import './meetTheTeam.css';

export default function MeetTheTeam() {
    const [selectedGroup, setSelectedGroup] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    const groups = getAllGroups();
    const teamByGroup = getTeamByGroup();
    
    // Filter logic
    const filteredTeam = useMemo(() => {
        let filtered = teamMembers;
        
        // Filter by group
        if (selectedGroup !== 'All') {
            filtered = filtered.filter(member => member.group === selectedGroup);
        }
        
        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(member => 
                member.name.toLowerCase().includes(query) ||
                member.role.toLowerCase().includes(query)
            );
        }
        
        // Group the filtered results
        const grouped = {};
        filtered.forEach(member => {
            if (!grouped[member.group]) {
                grouped[member.group] = [];
            }
            grouped[member.group].push(member);
        });
        
        // Sort within groups
        Object.keys(grouped).forEach(group => {
            grouped[group].sort((a, b) => a.order - b.order);
        });
        
        return grouped;
    }, [selectedGroup, searchQuery]);
    
    const totalMembers = Object.values(filteredTeam).reduce((sum, members) => sum + members.length, 0);
    
    return (
        <>
            <title>Meet the Team</title>
            <NavigationBar />
            
            <HeroSection title="About Us" theme="aboutus" />
            
            <section className="meet-team-page">
                <div className="meet-team-container">
                    {/* Filter Controls */}
                    <div className="team-filters">
                        <div className="filter-search">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by name or role..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Search team members"
                            />
                        </div>
                        
                        <div className="filter-buttons">
                            <button
                                className={`filter-btn ${selectedGroup === 'All' ? 'active all-teams-btn-color' : ''}`}
                                onClick={() => setSelectedGroup('All')}
                                aria-pressed={selectedGroup === 'All'}
                            >
                                All Teams
                            </button>
                            {groups.map(group => (
                                <button
                                    key={group}
                                    className={`filter-btn ${selectedGroup === group ? `active ${getButtonColorClass(group)}` : ''}`}
                                    onClick={() => setSelectedGroup(group)}
                                    aria-pressed={selectedGroup === group}
                                >
                                    {group}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Team Groups */}
                    {Object.keys(filteredTeam).length > 0 ? (
                        Object.entries(filteredTeam).map(([groupName, members]) => (
                            <div key={groupName} className="team-group-section">
                                <h2 className="team-group-title">{groupName}</h2>
                                <div className="team-grid">
                                    {members.map(member => {
                                        const groupColor = getGroupColor(member.group);
                                        return (
                                            <div 
                                                key={member.id} 
                                                className="team-card"
                                                style={{ borderColor: groupColor }}
                                            >
                                                <div 
                                                    className="team-card-image"
                                                    style={{
                                                        backgroundImage: `url(${member.image})`,
                                                        backgroundPosition: 'center',
                                                        backgroundSize: 'cover',
                                                        backgroundRepeat: 'no-repeat'
                                                    }}
                                                    role="img"
                                                    aria-label={member.alt}
                                                >
                                                    <img 
                                                        src={member.image} 
                                                        alt={member.alt}
                                                        loading="lazy"
                                                        style={{ 
                                                            width: '1px', 
                                                            height: '1px', 
                                                            opacity: 0 
                                                        }} 
                                                    />
                                                </div>
                                                <div 
                                                    className="team-card-info"
                                                    style={{ backgroundColor: groupColor }}
                                                >
                                                    <h3 className="team-card-name">{member.name}</h3>
                                                    <p className="team-card-role">{member.role}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No team members found matching your search.</p>
                        </div>
                    )}
                </div>
            </section>
            
            <Footer />
        </>
    );
}

// Helper function to get button color class based on group
function getButtonColorClass(group) {
    switch (group) {
        case 'Executives':
            return 'executives-btn-color';
        case 'Operations':
            return 'operations-btn-color';
        case 'Technology':
            return 'technology-btn-color';
        case 'Communications':
            return 'communications-btn-color';
        case 'Community Development':
            return 'community-development-btn-color';
        default:
            return '';
    }
}

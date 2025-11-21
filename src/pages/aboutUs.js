import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import HeroSection from "../components/HeroSection";
import './aboutUs.css'
import { Link } from "react-router-dom";
import sampleImage1 from '../assets/sample.png';
import sampleImage2 from '../assets/sample.png';
import storyImage from '../assets/story.png';
import { useEffect, useState } from "react";
import { getFeaturedMembers, getGroupColor } from '../data/team';

export default function AboutUs() {
    const [showMoreHistory, setShowMoreHistory] = useState(false);
    const [showMoreOperations, setShowMoreOperations] = useState(false);
    const [showMoreTechnology, setShowMoreTechnology] = useState(false);
    const [showMoreCommunications, setShowMoreCommunications] = useState(false);
    const [showMoreCommunityRelations, setShowMoreCommunityRelations] = useState(false);
    
    // Get featured team members for preview
    const featuredMembers = getFeaturedMembers(3);
    
    // Force image preloading to ensure they're available
    useEffect(() => {
        const img1 = new Image();
        const img2 = new Image();
        const img3 = new Image();
        img1.src = sampleImage1;
        img2.src = sampleImage2;
        img3.src = storyImage;
    }, []);
    
    return (
        <>
            <title>About us</title>
            <NavigationBar />

            <HeroSection title="About us" theme="aboutus" />

            <section className="who-are-we-section">
                <div className="who-are-we-container">
                    <h1 className="who-are-we-title">Who Are We?</h1>
                    
                    <div className="about-info-group top-group">
                        <div className="image-wrapper">
                            <div className="image-box left-image" style={{ 
                                backgroundImage: `url(${sampleImage1})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat'
                            }}>
                                {/* This hidden image helps ensure the container has dimensions on all browsers */}
                                <img 
                                    src={sampleImage1} 
                                    alt="Coffee cup" 
                                    style={{ 
                                        width: '1px', 
                                        height: '1px', 
                                        opacity: 0 
                                    }} 
                                />
                            </div>
                        </div>
                        <div className="text-container">
                            <h2 className="info-title">Fostering Innovation and Learning</h2>
                            <p className="info-text">Google Developer Groups (GDG) is a community of passionate developers interested in Google's developer technologies. We organize events, workshops, and learning opportunities to help developers grow their skills and build innovative solutions.</p>
                        </div>
                    </div>
                    
                    <div className="about-info-group bottom-group">
                        <div className="text-container right-aligned">
                            <h2 className="info-title">Building a Global Developer Community</h2>
                            <p className="info-text">Our mission is to create a vibrant ecosystem where developers can connect, learn, and collaborate. Through tech talks, hands-on workshops, and hackathons, we provide platforms for knowledge sharing and professional growth.</p>
                        </div>
                        <div className="image-wrapper">
                            <div className="image-box right-image" style={{ 
                                backgroundImage: `url(${sampleImage2})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat'
                            }}>
                                <img 
                                    src={sampleImage2} 
                                    alt="Coffee cup" 
                                    style={{ 
                                        width: '1px', 
                                        height: '1px', 
                                        opacity: 0 
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="our-history-section">
                <div className="our-history-container">
                    <h1 className="our-history-title">Our History</h1>
                    
                    <div className="history-group">
                        <div className="history-image" style={{ 
                            backgroundImage: `url(${storyImage})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}>
                            <img 
                                src={storyImage} 
                                alt="GDG History" 
                                style={{ 
                                    width: '1px', 
                                    height: '1px', 
                                    opacity: 0 
                                }} 
                            />
                        </div>
                        <div className="history-text-container">
                            <h2 className="history-title">The beginning</h2>
                            <p className="history-text">Google Developer Groups (GDGs) are community-led groups for developers interested in Google's developer technology. GDGs worldwide host different types of technical activities for developers, from just a few people getting together to larger gatherings with demos, tech talks, and hackathons.</p>
                        </div>
                    </div>
                    
                    {showMoreHistory && (
                        <div className="additional-history-content">
                            <div className="history-group">
                                <div className="history-text-container">
                                    <h2 className="history-title">Growing Community</h2>
                                    <p className="history-text">Since our founding, we’ve built a community of passionate student developers. Through workshops, speaker sessions, and projects, we help each other grow our skills and explore new opportunities in technology.</p>
                                </div>
                                <div className="history-image" style={{ 
                                    backgroundImage: `url(${sampleImage1})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat'
                                }}>
                                    <img 
                                        src={sampleImage1} 
                                        alt="GDG Community" 
                                        style={{ 
                                            width: '1px', 
                                            height: '1px', 
                                            opacity: 0 
                                        }} 
                                    />
                                </div>
                            </div>
                            
                            <div className="history-group">
                                <div className="history-image" style={{ 
                                    backgroundImage: `url(${sampleImage1})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat'
                                }}>
                                    <img 
                                        src={sampleImage1} 
                                        alt="GDG Events" 
                                        style={{ 
                                            width: '1px', 
                                            height: '1px', 
                                            opacity: 0 
                                        }} 
                                    />
                                </div>
                                <div className="history-text-container">
                                    <h2 className="history-title">Looking ahead</h2>
                                    <p className="history-text">Today, we continue to foster innovation and knowledge sharing within our developer community. We're focused on emerging technologies like AI, machine learning, and cloud computing, providing resources and support for developers at all stages of their journey.</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="show-more-container">
                        <button 
                            className="show-more-button"
                            onClick={() => setShowMoreHistory(!showMoreHistory)}
                        >
                            <span className="show-more-text">{showMoreHistory ? 'Show less' : 'Show more'}</span>
                            <div className="show-more-icon" style={{ 
                                transform: showMoreHistory ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}></div>
                        </button>
                    </div>
                </div>
            </section>

            <section className="meet-team-section">
                <h1 className="meet-team-title">Meet the Team</h1>
                
                <div className="team-container">
                    <h2 className="team-section-title">Executives</h2>
                    
                    <div className="team-members-row">
                        {featuredMembers.map(member => {
                            const groupColor = getGroupColor(member.group);
                            return (
                                <div 
                                    key={member.id} 
                                    className="team-member-card"
                                    style={{ borderColor: groupColor }}
                                >
                                    <div className="team-member-image" style={{ 
                                        backgroundImage: `url(${encodeURI(member.image)})`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                        <img 
                                            src={encodeURI(member.image)} 
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
                                        className="team-member-info"
                                        style={{ backgroundColor: groupColor }}
                                    >
                                        <div className="team-member-text">
                                            <h3 className="team-member-name">{member.name}</h3>
                                            <p className="team-member-position">{member.role}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="show-all-container">
                        <Link to="/team" className="show-all-button">
                            <span className="show-all-text">View All</span>
                            <div className="show-all-icon"></div>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="operations-section">
                <div className="operations-container">
                    <h1 className="operations-title">Operations</h1>
                    
                    <div className="operations-group">
                        <div className="operations-image" style={{ 
                            backgroundImage: `url(${sampleImage1})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}>
                            <img 
                                src={sampleImage1} 
                                alt="GDG Operations" 
                                style={{ 
                                    width: '1px', 
                                    height: '1px', 
                                    opacity: 0 
                                }} 
                            />
                        </div>
                        <div className="operations-text-container">
                            <h2 className="operations-title-text">Seamless Event Management</h2>
                            <p className="operations-description">Our operations team ensures that all GDG activities run smoothly, from venue coordination to technical setup. We handle logistics, participant registration, and resource allocation to create engaging and productive developer experiences.</p>
                        </div>
                    </div>
                    
                    {showMoreOperations && (
                        <div className="additional-operations-content">
                            <div className="operations-group">
                                <div className="operations-text-container">
                                    <h2 className="operations-title-text">Enhancing efficiency</h2>
                                    <p className="operations-description">Our operations team works tirelessly to ensure that all GDG events and initiatives run smoothly. From logistics to technical setup, we handle the behind-the-scenes work that makes our community initiatives possible.</p>
                                </div>
                                <div className="operations-image" style={{ 
                                    backgroundImage: `url(${sampleImage2})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat'
                                }}>
                                    <img 
                                        src={sampleImage2} 
                                        alt="GDG Operations Team" 
                                        style={{ 
                                            width: '1px', 
                                            height: '1px', 
                                            opacity: 0 
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="view-more-container">
                        <button 
                            className="view-more-button"
                            onClick={() => setShowMoreOperations(!showMoreOperations)}
                        >
                            <span className="view-more-text">{showMoreOperations ? 'Show Less' : 'Show More'}</span>
                            <div className="view-more-icon" style={{ 
                                transform: showMoreOperations ? 'rotate(270deg)' : 'rotate(90deg)'
                            }}></div>
                        </button>
                    </div>
                </div>
            </section>

            <section className="technology-section">
                <div className="technology-container">
                    <h1 className="technology-title">Technology</h1>
                    
                    <div className="technology-group">
                        <div className="technology-image" style={{ 
                            backgroundImage: `url(${sampleImage2})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}>
                            <img 
                                src={sampleImage2} 
                                alt="GDG Technology" 
                                style={{ 
                                    width: '1px', 
                                    height: '1px', 
                                    opacity: 0 
                                }} 
                            />
                        </div>
                        <div className="technology-text-container">
                            <h2 className="technology-title-text">Cutting-edge Tech Focus</h2>
                            <p className="technology-description">At GDG, we explore and share knowledge on the latest Google technologies including Android, Flutter, Firebase, TensorFlow, Cloud, and Web. Our technical sessions and code labs provide hands-on experience with emerging technologies and best practices.</p>
                        </div>
                    </div>
                    
                    {showMoreTechnology && (
                        <div className="additional-technology-content">
                            <div className="technology-group">
                                <div className="technology-text-container">
                                    <h2 className="technology-title-text">Driving innovation</h2>
                                    <p className="technology-description">Our technology team works to implement cutting-edge solutions for our community. From developing applications to facilitating workshops, we enable members to stay ahead of the technology curve and develop valuable skills.</p>
                                </div>
                                <div className="technology-image" style={{ 
                                    backgroundImage: `url(${sampleImage1})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat'
                                }}>
                                    <img 
                                        src={sampleImage1} 
                                        alt="GDG Technology Innovation" 
                                        style={{ 
                                            width: '1px', 
                                            height: '1px', 
                                            opacity: 0 
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="view-more-container">
                        <button 
                            className="view-more-button"
                            onClick={() => setShowMoreTechnology(!showMoreTechnology)}
                        >
                            <span className="view-more-text">{showMoreTechnology ? 'Show Less' : 'Show More'}</span>
                            <div className="view-more-icon" style={{ 
                                transform: showMoreTechnology ? 'rotate(270deg)' : 'rotate(90deg)'
                            }}></div>
                        </button>
                    </div>
                </div>
            </section>

            <section className="communications-section">
                <div className="communications-container">
                    <h1 className="communications-title">Communications</h1>
                    
                    <div className="communications-group">
                        <div className="communications-image" style={{ 
                            backgroundImage: `url(${sampleImage1})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}>
                            <img 
                                src={sampleImage1} 
                                alt="GDG Communications" 
                                style={{ 
                                    width: '1px', 
                                    height: '1px', 
                                    opacity: 0 
                                }} 
                            />
                        </div>
                        <div className="communications-text-container">
                            <h2 className="communications-title-text">Engaging Our Developer Network</h2>
                            <p className="communications-description">Our communications team creates compelling content across multiple channels to keep our community informed and engaged. We share technical updates, event information, and success stories to inspire and connect developers throughout our network.</p>
                        </div>
                    </div>
                    
                    {showMoreCommunications && (
                        <div className="additional-communications-content">
                            <div className="communications-group">
                                <div className="communications-text-container">
                                    <h2 className="communications-title-text">Spreading the word</h2>
                                    <p className="communications-description">Our communications team ensures that our message reaches far and wide. Through social media, email newsletters, and other channels, we keep our community informed about events, opportunities, and the latest technology trends.</p>
                                </div>
                                <div className="communications-image" style={{ 
                                    backgroundImage: `url(${sampleImage2})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat'
                                }}>
                                    <img 
                                        src={sampleImage2} 
                                        alt="GDG Communications Team" 
                                        style={{ 
                                            width: '1px', 
                                            height: '1px', 
                                            opacity: 0 
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="view-more-container">
                        <button 
                            className="view-more-button"
                            onClick={() => setShowMoreCommunications(!showMoreCommunications)}
                        >
                            <span className="view-more-text">{showMoreCommunications ? 'Show Less' : 'Show More'}</span>
                            <div className="view-more-icon" style={{ 
                                transform: showMoreCommunications ? 'rotate(270deg)' : 'rotate(90deg)'
                            }}></div>
                        </button>
                        </div>
                    </div>
                </section>

            <section className="community-relations-section">
                <div className="community-relations-container">
                    <h1 className="community-relations-title">Community Relations</h1>
                    
                    <div className="community-relations-group">
                        <div className="community-relations-image" style={{ 
                            backgroundImage: `url(${sampleImage2})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat'
                        }}>
                            <img 
                                src={sampleImage2} 
                                alt="GDG Community Relations" 
                                style={{ 
                                    width: '1px', 
                                    height: '1px', 
                                    opacity: 0 
                                }} 
                            />
                        </div>
                        <div className="community-relations-text-container">
                            <h2 className="community-relations-title-text">Strategic Partnerships</h2>
                            <p className="community-relations-description">We build and maintain relationships with universities, tech companies, and other developer communities to expand our reach and impact. Through these partnerships, we create opportunities for mentorship, internships, and career advancement for our members.</p>
                        </div>
                    </div>
                    
                    {showMoreCommunityRelations && (
                        <div className="additional-community-relations-content">
                            <div className="community-relations-group">
                                <div className="community-relations-text-container">
                                    <h2 className="community-relations-title-text">Building bridges</h2>
                                    <p className="community-relations-description">Our community relations team works to foster connections between members, industry partners, and the broader tech ecosystem. We build partnerships that provide value to our community and create opportunities for learning and career advancement.</p>
                                </div>
                                <div className="community-relations-image" style={{ 
                                    backgroundImage: `url(${sampleImage1})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat'
                                }}>
                                    <img 
                                        src={sampleImage1} 
                                        alt="GDG Community Relations Team" 
                                        style={{ 
                                            width: '1px', 
                                            height: '1px', 
                                            opacity: 0 
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="view-more-container">
                        <button 
                            className="view-more-button"
                            onClick={() => setShowMoreCommunityRelations(!showMoreCommunityRelations)}
                        >
                            <span className="view-more-text">{showMoreCommunityRelations ? 'Show Less' : 'Show More'}</span>
                            <div className="view-more-icon" style={{ 
                                transform: showMoreCommunityRelations ? 'rotate(270deg)' : 'rotate(90deg)'
                            }}></div>
                        </button>
                    </div>
                </div>
            </section>

            <Footer/>
        </>
    )
}
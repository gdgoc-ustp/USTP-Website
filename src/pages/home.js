import React, { useEffect } from 'react';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import './home.css';
import './main.css'
import About from '../assets/sample.png';
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <>
            <NavigationBar />
            <main>
                <header className="banner">
                    <h1>
                        <span>Building Good Things, </span>
                        <span id="gradient">&nbsp;Together!</span>
                    </h1>
                    <p id="tagline">Rorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <button>
                        Learn More
                    </button>
                </header>

                <section className="section-1">
                    <div className="section-1-container">
                        <div className="about-content">
                            <div className="about-left">
                                <img src={About} alt='About us' />
                            </div>
                            <div className="about-right">
                                <h2>Lorem ipsum dolor sit amet</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan.</p>
                                <div style={{ width: 494 }}>
                                    <Link to="/aboutus">
                                        <button>Read More</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="team">
                            <div className="team-left">
                                <h2>Lorem ipsum dolor sit amet</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan.</p>
                            </div>
                            <div className="team-right">
                                <img src={About} alt='About us' />
                            </div>
                        </div>
                    </div>
                </section>

                
                <section className="trusted" data-aos="fade-up">
                    <h1>Trusted by People</h1>
                    <div className="trusted-logos">
                        <img src={require('../assets/picturetest.jpg')} alt="pic 1" />
                        <img src={require('../assets/picturetest.jpg')} alt="pic 2" />
                        <img src={require('../assets/picturetest.jpg')} alt="pic 3" />
                        <img src={require('../assets/picturetest.jpg')} alt="pic 4" />
                        <img src={require('../assets/picturetest.jpg')} alt="pic 5" />
                        <img src={require('../assets/picturetest.jpg')} alt="pic 6" />
                        <img src={require('../assets/picturetest.jpg')} alt="pic 7" />
                        <img src={require('../assets/picturetest.jpg')} alt="pic 8" />
                        <img src={require('../assets/picturetest.jpg')} alt="pic 9" />
                        <img src={require('../assets/picturetest.jpg')} alt="pic 10" />
                        <img src={require('../assets/picturetest.jpg')} alt="pic 11" />
                        <img src={require('../assets/picturetest.jpg')} alt="pic 12" />
                    </div>
                </section>

                <section className="gallery" data-aos="fade-up">
                    <h1>Inspiring Members</h1>
                    <div className="gallery-container">
                    <div class="text-content">
                        <div class="quote">"GDSC revolutionized the way I work with its innovative and user-friendly products."</div>
                        <div class="reviewer">- Some Random Review</div>
                        <a href="#" class="cta-link">See More of Stranger's Story →</a>
                        </div>
                    </div>
                </section>

                <section className="wtsup-wrapper">
                    <div className="wtsup-section">
                        <h1 className="wtsup-heading">What’s Up?</h1>
                        <div className="wtsup-container">
                            <div className="wtsup-card">
                                <img src={About} alt="Silhouette" className="wtsup-image" />
                                <h2 className="wtsup-title">Lorem ipsum dolor sit amet</h2>
                                <p className="wtsup-time">An hour ago</p>
                                <p className="wtsup-description">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
                                </p>
                            </div>
                            <div className="wtsup-card">
                                <img src={About} alt="Night sky" className="wtsup-image" />
                                <h2 className="wtsup-title">Lorem ipsum dolor sit amet</h2>
                                <p className="wtsup-time">An hour ago</p>
                                <p className="wtsup-description">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
                                </p>
                            </div>
                        </div>
                        <div className="wtsup-button-container">
                            <button className="wtsup-button">Show More ↓</button>
                        </div>
                    </div>
                </section>



                <section className="cta" data-aos="fade-up">
                    <h1>CTA</h1>
                </section>
            </main>
            <Footer />
        </>
    );
}

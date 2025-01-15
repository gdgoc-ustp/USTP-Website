import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import './main.css'

import './news.css';
import { Link } from "react-router-dom";
import Sample from '../assets/sample.png';

export default function News() {
    return (
        <>
            <title>News</title>
            <NavigationBar />

            <section className="news">
                <h1>News</h1>
            </section>


            <section className="section-1">
                <div className="section-1-container">
                <h2>Ongoing Events</h2>
                <div className="card-container">
                    <div className="card">
                        <img src={Sample} alt="Event thumbnail"/>
                        <div className="card-content">
                            <h3 className="card-title">Lorem ipsum dolor sit amet</h3>
                            <p className="card-registration">An hour ago</p>
                            <p className="card-description">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.
                            </p>
                            <a href="#" className="card-button">Read</a>
                        </div>
                    </div>

                    <div className="card">
                        <img src={Sample} alt="Event thumbnail"/>
                        <div className="card-content">
                            <h3 className="card-title">Lorem ipsum dolor sit amet</h3>
                            <p className="card-registration">An hour ago</p>
                            <p className="card-description">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.
                            </p>
                            <a href="#" className="card-button">Read</a>
                        </div>
                    </div>
                </div>
                
                <button className="show-more-button">
                    Show More
                    <svg viewBox="0 0 24 24">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                </button>

              
            </div>
            <section className="hero-card">
                    <div className="hero-card-container">
                        <div className="hero-card-image">
                            <img src={Sample} alt="Coffee cup"/>
                        </div>
                        <div className="hero-card-content">
                            <h2>Lorem ipsum dolor sit amet</h2>
                            <p>Lorem ipsum dolor sit amet</p>
                            <a href="#" className="hero-card-button">Learn More</a>
                        </div>
                    </div>
                </section>
                {/* <div className="about-left">
                <img src={Sample}></img>
                <h2>Test</h2>
                </div> */}

                </section>
                
            <Footer />
        </>
    );
}

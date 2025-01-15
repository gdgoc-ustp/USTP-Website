import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import './main.css'

import './news.css';
import { Link } from "react-router-dom";

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
                        <div className="about-content">
                            <div className="about-left">
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
                            </div>
                        </div>
                    </div>
                </section>
            <Footer />
        </>
    );
}

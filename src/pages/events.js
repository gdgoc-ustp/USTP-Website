    import React, { useEffect } from 'react';
    import NavigationBar from "../components/navBar";
    import Footer from "../components/footer";
    import './events.css'; 
    import './main.css'
    import Sample from '../assets/sample.png';

    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import { Link } from "react-router-dom";

    export default function Events() {
        useEffect(() => {
            AOS.init();
        }, []);

        return (
            <>
            
                <title>Events</title>
                <NavigationBar />
                <main>
                <section className="events">
                    
                    <h1>Events</h1>
                </section>

                </main>
                <Footer />
            </>
            
        );
    }

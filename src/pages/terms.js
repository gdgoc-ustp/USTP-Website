import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import './policy.css';
import { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import { useLocation } from "react-router-dom";

export default function TermsOfUse() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        const el = document.querySelector(".page-transition");
        if (el) {
            el.classList.add("show");
        }
    }, []);

    return (
        <div className="page-transition">
            <NavigationBar />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"></link>

            {/* Hero Section */}
            <HeroSection title="Terms of Use" theme="aboutus" previousPath={location.state?.from} />

            <div className="policy-container">
                <div className="policy-page">

                    <p className="policy-effective-date">Effective Date: January 1, 2025</p>
                    <p className="policy-intro">
                        These Terms of Use outline the rules and guidelines for accessing and using the Google Developers Group on Campus (GDG on Campus) website, online platforms, and community services. By using our site or participating in our activities, you agree to follow all terms stated here.
                    </p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing our website or joining our events, you confirm that you have read, understood, and agreed to these Terms of Use. If you do not agree, please discontinue use of our services.
                    </p>

                    <h2>2. Use of Our Website and Services</h2>
                    <p>You agree to use the platform responsibly and only for lawful purposes. You MUST NOT:</p>
                    <ul>
                        <li>Engage in activities that may damage, disrupt, or impair our website or services</li>
                        <li>Attempt unauthorized access to servers, databases, or user accounts</li>
                        <li>Use automated tools (e.g., bots, scrapers) without permission</li>
                        <li>Distribute harmful software, phishing links, or malicious content</li>
                        <li>Upload inappropriate, offensive, or misleading materials</li>
                    </ul>

                    <h2>3. Community Conduct</h2>
                    <p>When interacting with GDG members or participating in events, you agree to:</p>
                    <ul>
                        <li>Show respect and professionalism</li>
                        <li>Follow event guidelines, safety instructions, and community rules</li>
                        <li>Avoid harassing, abusive, or discriminatory behavior</li>
                        <li>Collaborate in a constructive and inclusive manner</li>
                    </ul>

                    <h2>4. Intellectual Property</h2>
                    <p>All materials on our website—such as graphics, content, branding, and resources—are the property of GDG on Campus, Google Developers, or their respective owners. You may not:</p>
                    <ul>
                        <li>Copy, reproduce, or distribute content without permission</li>
                        <li>Modify or resell digital or event materials</li>
                        <li>Use GDG logos or branding without official approval</li>
                    </ul>

                    <h2>5. User Contributions</h2>
                    <p>By submitting feedback, projects, suggestions, or other content to GDG on Campus, you:</p>
                    <ul>
                        <li>Grant us permission to use your contributions for community-related purposes such as events and documentation</li>
                        <li>Confirm you have rights to share the submitted content</li>
                    </ul>

                    <h2>6. Third-Party Platforms</h2>
                    <p>
                        Our website may include links to external platforms like Facebook, LinkedIn, Discord, or event registration tools. GDG on Campus is not responsible for:
                    </p>
                    <ul>
                        <li>The content of third-party websites</li>
                        <li>Their privacy policies and terms</li>
                        <li>Any risks associated with using external services</li>
                    </ul>

                    <h2>7. Disclaimer of Warranties</h2>
                    <p>
                        Our website and services are provided “as is” and “as available.” We do not guarantee that:
                    </p>
                    <ul>
                        <li>The site will always be available without interruptions</li>
                        <li>Content will always be error-free or up to date</li>
                        <li>Online features will function perfectly at all times</li>
                    </ul>

                    <h2>8. Limitation of Liability</h2>
                    <p>
                        GDG on Campus is not liable for any direct or indirect damages resulting from:
                    </p>
                    <ul>
                        <li>Use of our website or participation in events</li>
                        <li>Technical issues, delays, or system failures</li>
                        <li>Loss of data or personal inconvenience</li>
                    </ul>

                    <h2>9. Termination of Use</h2>
                    <p>
                        We reserve the right to suspend or remove access if you violate these Terms of Use, threaten community safety, or misuse the platform.
                    </p>

                    <h2>10. Changes to These Terms</h2>
                    <p>
                        We may update these Terms of Use at any time. Updated versions will be posted on our website with a new “Effective Date.” Continued use means you accept the updated terms.
                    </p>

                    <h2>11. Contact Us</h2>
                    <p>If you have questions or concerns about these Terms of Use, you may contact us:</p>
                    <p>Email us at: 📧 <a href="mailto:gdsc@ustp.edu.ph">gdsc@ustp.edu.ph</a></p>
                    <p>Message us at:
                        <a href="https://www.facebook.com/dscustp" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook"></i> Facebook
                        </a>
                    </p>
                    <p>Visit us at <b>Building 5, Near Alumni Federation Office, USTP CDO</b></p>

                </div>
            </div>

            <Footer />
        </div>
    );
}

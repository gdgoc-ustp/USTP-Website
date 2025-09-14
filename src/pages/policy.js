import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import './policy.css'

export default function Policy() {
    return (
        <div>
            <NavigationBar />
            <div className="policy-page">
                <h1>Privacy Policy</h1>
                <p>Effective Date: January 1, 2024</p>
            </div>
            <Footer />
        </div>

    );
}
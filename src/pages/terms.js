import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import './terms.css'


export default function Terms() {
    return (
        <div>
            <NavigationBar />
            <div className="terms-page">
                <h1>Terms of Use</h1>
                <p>Effective Date: January 1, 2024</p>
            </div>
            window.scrollTo(0, 0);

            <Footer />
        </div>
        
    );
    
}
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import { analyzePersonalityCode } from "../lib/gemini";
import { isValidPersonalityCode } from "../lib/personalityCodes";
import "./personalityTest.css";

export default function PersonalityTest() {
    const { id } = useParams();
    const [personalityData, setPersonalityData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    useEffect(() => {
        const analyzePersonality = async () => {
            // Prevent duplicate calls in React StrictMode
            if (hasAnalyzed) return;

            try {
                setLoading(true);
                setError(null);
                setHasAnalyzed(true);

                // Validate the personality code
                const isValid = isValidPersonalityCode(id);
                if (!isValid) {
                    throw new Error("Invalid personality code. Please provide a valid 10-letter code.");
                }

                // Call Gemini API to analyze the personality code
                const analysis = await analyzePersonalityCode(id);
                setPersonalityData(analysis);

            } catch (err) {
                console.error("Error analyzing personality:", err);
                setHasAnalyzed(false); // Reset on error to allow retry

                // Handle specific error types
                if (err.message === 'INVALID_CODE') {
                    setError("Invalid personality code combination. The letters you provided don't form a valid personality type according to our system. Please check your code or take the personality quiz to get a valid code.");
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id && !hasAnalyzed) {
            analyzePersonality();
        } else if (!id) {
            setError("No personality code provided");
            setLoading(false);
        }
    }, [id, hasAnalyzed]);

    const handleRetry = () => {
        setHasAnalyzed(false);
        setError(null);
        setLoading(true);
        setPersonalityData(null);
    };

    // Determine theme based on ideal department
    const getThemeClass = (department) => {
        if (!department) return '';

        const departmentLower = department.toLowerCase();
        if (departmentLower.includes('technology')) return 'technology-theme';
        if (departmentLower.includes('operations')) return 'operations-theme';
        if (departmentLower.includes('communications')) return 'communications-theme';
        if (departmentLower.includes('comdev')) return 'community-theme';
        if (departmentLower.includes('Community Development')) return 'community-theme';
        return '';
    };

    const themeClass = personalityData ? getThemeClass(personalityData.coreType.idealDepartment) : '';

    return (
        <>
            <title>
                {personalityData
                    ? `${personalityData.coreType.title} - Personality Test Results`
                    : "Personality Test Results"
                }
            </title>
            <NavigationBar />
            <main className={`personality-test-page ${themeClass}`}>
                {loading ? (
                    <div className="personality-content">
                        <div className="personality-loading">
                            <div className="loading-spinner"></div>
                            <p>Analyzing your personality code...</p>
                            <p className="loading-code">Code: {id?.toUpperCase()}</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="personality-content">
                        <div className="personality-error">
                            <h2>Unable to Analyze Personality Code</h2>
                            <p>{error}</p>
                            <div className="error-buttons">
                                <button onClick={handleRetry} className="retry-button">
                                    Try Again
                                </button>
                                <Link to="/personality-test" className="quiz-button">
                                    Take Personality Quiz
                                </Link>
                                <Link to="/" className="back-button">
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : personalityData ? (
                    <>
                        {/* Results Header */}
                        <div className="personality-results-header">
                            <div className="container">
                                <div className="personality-code-badge">
                                    <span className="code-label">Your Personality Code</span>
                                    <div className="personality-code">{personalityData.personalityCode}</div>
                                </div>
                                <h1 className="personality-title">{personalityData.coreType.title}</h1>
                                <p className="personality-subtitle">{personalityData.coreType.summary}</p>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="personality-content">
                            {/* Core Type Section */}
                            <section className="personality-section">
                                <h2 className="section-title">Your Core Type</h2>
                                <div className="core-type-grid">
                                    <div className="core-type-card">
                                        <h4>Strengths</h4>
                                        <ul className="strengths-list">
                                            {personalityData.coreType.strengths.map((strength, index) => (
                                                <li key={index}>{strength}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    {personalityData.coreType.weaknesses && (
                                        <div className="core-type-card">
                                            <h4>Areas for Growth</h4>
                                            <ul className="weaknesses-list">
                                                {personalityData.coreType.weaknesses.map((weakness, index) => (
                                                    <li key={index}>{weakness}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="core-type-card">
                                        <h4>Ideal Work</h4>
                                        <p className="ideal-work-text">{personalityData.coreType.idealWork}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Work Style Traits Section */}
                            <section className="personality-section">
                                <h2 className="section-title">Your Work Style Traits</h2>
                                <p className="work-style-intro">Based on the last 6 letters of your code:</p>
                                <div className="work-style-grid">
                                    {Object.entries(personalityData.workStyleTraits).map(([letter, description]) => {
                                        // Parse the description to get title and description
                                        const parts = description.split(': ');
                                        const title = parts[0] || letter;
                                        const desc = parts[1] || description;

                                        return (
                                            <div key={letter} className="work-style-trait">
                                                <div className="trait-letter">{letter}</div>
                                                <div className="trait-content">
                                                    <div className="trait-title">{title}</div>
                                                    <div className="trait-description">{desc}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Why Join GDG Section */}
                            {personalityData.coreType["joinReason"] && (
                                <section className="personality-section">
                                    <h2 className="section-title">Why Join GDG on Campus?</h2>
                                    <div className="why-join-content">
                                        <p className="why-join-text">{personalityData.coreType["joinReason"]}</p>
                                    </div>
                                </section>
                            )}

                            {/* Department Recommendation Card */}
                            <div className="department-recommendation">
                                <div className="department-card">
                                    <div className="department-content">
                                        <h3>Perfect Department Match</h3>
                                        <p>Based on your personality analysis, you're encouraged to join the <strong>{personalityData.coreType.idealDepartment}</strong> department where you'll thrive the most!</p>
                                        <p className="department-alternative">Don't worry if this doesn't feel right - you can always join as a general member and explore different areas.</p>
                                    </div>
                                    <div className="department-cta">
                                        <Link
                                            to="/contact"
                                            className="register-cta-button"
                                        >
                                            Join GDG USTP
                                        </Link>
                                        <p className="cta-subtitle">Start your developer journey with us!</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Section */}
                            <div className="personality-actions">
                                <div className="action-buttons">
                                    <button onClick={() => window.print()} className="cta-button primary">
                                        Save Results
                                    </button>
                                    <Link to="/" className="cta-button secondary">
                                        Back to Home
                                    </Link>
                                </div>
                                <div className="share-section">
                                    <p>Share your personality code with friends!</p>
                                    <div className="share-code-container">
                                        <span className="share-code-text">{personalityData.personalityCode}</span>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(personalityData.personalityCode)}
                                            className="copy-button"
                                        >
                                            Copy Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </main>
            <Footer />
        </>
    );
}

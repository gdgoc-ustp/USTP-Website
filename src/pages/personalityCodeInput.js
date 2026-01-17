import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import HeroSection from "../components/HeroSection";
import { isValidPersonalityCode } from "../lib/personalityCodes";
import "./personalityCodeInput.css";

export default function PersonalityCodeInput() {
    const navigate = useNavigate();
    const [code, setCode] = useState(Array(10).fill(''));
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRefs = useRef([]);

    const handleInputChange = (index, value) => {
        // Only allow letters
        const letter = value.replace(/[^A-Za-z]/g, '').toUpperCase();
        
        if (letter.length <= 1) {
            const newCode = [...code];
            newCode[index] = letter;
            setCode(newCode);
            setError('');

            // Auto-focus next input
            if (letter && index < 9) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            // Focus previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 9) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text').replace(/[^A-Za-z]/g, '').toUpperCase();
        
        if (pastedText.length <= 10) {
            const newCode = Array(10).fill('');
            for (let i = 0; i < pastedText.length; i++) {
                newCode[i] = pastedText[i];
            }
            setCode(newCode);
            setError('');
            
            // Focus the next empty input or the last one
            const nextIndex = Math.min(pastedText.length, 9);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const personalityCode = code.join('');

        if (personalityCode.length !== 10) {
            setError('Please enter all 10 letters of your personality code.');
            setIsSubmitting(false);
            return;
        }

        const isValid = isValidPersonalityCode(personalityCode);
        if (!isValid) {
            setError('Please enter a valid personality code. This combination is not recognized in our system.');
            setIsSubmitting(false);
            return;
        }

        // Navigate to results page
        navigate(`/personality-test/${personalityCode}`);
    };

    const handleClear = () => {
        setCode(Array(10).fill(''));
        setError('');
        inputRefs.current[0]?.focus();
    };

    return (
        <>
            <title>Enter Personality Code - GDG USTP</title>
            <NavigationBar />
            <main className="personality-code-input-page">
                <HeroSection title="Enter Your Personality Code" theme="home" />
                
                <section className="code-input-section">
                    <div className="container">
                        <div className="code-input-content">
                            <div className="code-input-header">
                                <h2>Enter Your 10-Letter Personality Code</h2>
                                <p>
                                    If you have a personality code from a previous test or assessment, 
                                    enter it below to see your detailed personality analysis.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="code-input-form">
                                <div className="code-inputs">
                                    {code.map((letter, index) => (
                                        <input
                                            key={index}
                                            ref={el => inputRefs.current[index] = el}
                                            type="text"
                                            value={letter}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={handlePaste}
                                            className="code-input"
                                            maxLength="1"
                                            placeholder="_"
                                            autoComplete="off"
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <div className="error-message">
                                        {error}
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="submit-button"
                                    >
                                        {isSubmitting ? 'Analyzing...' : 'Get My Personality Analysis'}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="clear-button"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>

                            <div className="alternative-options">
                                <p>Don't have a personality code?</p>
                                <button
                                    onClick={() => navigate('/personality-test')}
                                    className="take-quiz-button"
                                >
                                    Take the Personality Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

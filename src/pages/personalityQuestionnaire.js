import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import HeroSection from "../components/HeroSection";
import "./personalityQuestionnaire.css";

const questions = [
    {
        id: 1,
        emoji: "🧍‍♂️",
        question: "How do you usually approach problems?",
        subtitle: "(Social energy)",
        options: [
            { value: "I", label: "I like figuring things out quietly and independently" },
            { value: "E", label: "I prefer bouncing ideas off people and working in groups" }
        ]
    },
    {
        id: 2,
        emoji: "🛠",
        question: "When working on a project, you mostly care about:",
        subtitle: "(Work focus)",
        options: [
            { value: "D", label: "Doing — making something that works (apps, prototypes, systems)" },
            { value: "T", label: "Thinking — understanding the logic, data, and planning behind things" }
        ]
    },
    {
        id: 3,
        emoji: "🎨",
        question: "What's more satisfying to you?",
        subtitle: "(Motivation style)",
        options: [
            { value: "C", label: "Creating something beautiful or usable" },
            { value: "S", label: "Solving something broken or inefficient" }
        ]
    },
    {
        id: 4,
        emoji: "⚡",
        question: "What excites you most about tech?",
        subtitle: "(Curiosity driver)",
        options: [
            { value: "F", label: "Making real stuff (hardware, websites, working models)" },
            { value: "A", label: "Discovering ideas, systems, data, or future potential" }
        ]
    },
    {
        id: 5,
        emoji: "🧭",
        question: "What's your favorite kind of task?",
        subtitle: "(Problem preference)",
        options: [
            { value: "R", label: "Repeating a process to improve it" },
            { value: "N", label: "Figuring out something entirely new" }
        ]
    },
    {
        id: 6,
        emoji: "🧠",
        question: "How do you usually learn best?",
        subtitle: "(Learning style)",
        options: [
            { value: "X", label: "Self-taught, trial and error" },
            { value: "Y", label: "With people — guided or collaborative learning" }
        ]
    },
    {
        id: 7,
        emoji: "📅",
        question: "When planning your day, you prefer:",
        subtitle: "(Work flow)",
        options: [
            { value: "S", label: "Having a clear structure" },
            { value: "F", label: "Following what feels right in the moment" }
        ]
    },
    {
        id: 8,
        emoji: "👥",
        question: "In a team, you often end up being the one who:",
        subtitle: "(Team dynamic)",
        options: [
            { value: "L", label: "Keeps things organized, behind the scenes" },
            { value: "Z", label: "Talks, pushes ideas, keeps momentum" }
        ]
    },
    {
        id: 9,
        emoji: "🧩",
        question: "What feels more natural to you?",
        subtitle: "(Thinking preference)",
        options: [
            { value: "B", label: "Breaking things into parts and solving step-by-step" },
            { value: "V", label: "Seeing the big picture and direction first" }
        ]
    },
    {
        id: 10,
        emoji: "🕹",
        question: "When trying new tech/tools, you usually:",
        subtitle: "(Tech approach)",
        options: [
            { value: "H", label: "Dive in and try it" },
            { value: "K", label: "Research and prepare first" }
        ]
    }
];

export default function PersonalityQuestionnaire() {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleAnswerSelect = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        
        // Build personality code from answers
        const personalityCode = questions.map(q => answers[q.id] || '').join('');
        
        if (personalityCode.length !== 10) {
            alert('Please answer all questions before submitting.');
            setIsSubmitting(false);
            return;
        }

        // Navigate to results page
        navigate(`/personality-test/${personalityCode}`);
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentQ = questions[currentQuestion];
    const isAnswered = answers[currentQ.id];
    const allAnswered = questions.every(q => answers[q.id]);

    return (
        <>
            <title>Personality Quiz - GDG USTP</title>
            <NavigationBar />
            <main className="personality-questionnaire-page">
                <HeroSection title="Personality Test" theme="home" />
                
                <section className="questionnaire-section">
                    <div className="container">
                        <div className="questionnaire-content">
                            {/* Progress bar */}
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="progress-text">
                                    Question {currentQuestion + 1} of {questions.length}
                                </div>
                            </div>

                            {/* Question card */}
                            <div className="question-card">
                                <div className="question-header">
                                    <div className="question-emoji">{currentQ.emoji}</div>
                                    <div className="question-number">
                                        {currentQ.id}. {currentQ.question}
                                    </div>
                                    <div className="question-subtitle">{currentQ.subtitle}</div>
                                </div>

                                <div className="question-options">
                                    {currentQ.options.map((option, index) => (
                                        <label 
                                            key={option.value}
                                            className={`option-label ${answers[currentQ.id] === option.value ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${currentQ.id}`}
                                                value={option.value}
                                                checked={answers[currentQ.id] === option.value}
                                                onChange={() => handleAnswerSelect(currentQ.id, option.value)}
                                                className="option-input"
                                            />
                                            <div className="option-content">
                                                <div className="option-letter">{option.value}</div>
                                                <div className="option-text">{option.label}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation buttons */}
                            <div className="question-navigation">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentQuestion === 0}
                                    className="nav-button prev-button"
                                >
                                    Previous
                                </button>

                                {currentQuestion === questions.length - 1 ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!allAnswered || isSubmitting}
                                        className="nav-button submit-button"
                                    >
                                        {isSubmitting ? 'Analyzing...' : 'Get My Results'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        disabled={!isAnswered}
                                        className="nav-button next-button"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>

                            {/* Alternative option */}
                            <div className="alternative-option">
                                <p>Already have a personality code?</p>
                                <button
                                    onClick={() => navigate('/personality-test/code')}
                                    className="code-input-link"
                                >
                                    Enter Your Code
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

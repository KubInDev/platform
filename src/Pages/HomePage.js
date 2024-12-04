import React from 'react';
import './HomePage.css';

const HomePage = () => {
    const handleFeedbackSelection = (type) => {
        localStorage.setItem('feedbackType', type);
        window.location.href = '/pre-test'; // Redirect to the pre-test page
    };

    return (
        <div className="homepage">
            <header className="homepage-header">
                <h1>Feedback Test Program</h1>
                <p>Choose Your Feedback Type</p>
            </header>
            <main className="homepage-main">
                <button
                    className="feedback-button binary"
                    onClick={() => handleFeedbackSelection('binary')}
                >
                    Binary Feedback
                </button>
                <button
                    className="feedback-button gradual"
                    onClick={() => handleFeedbackSelection('gradual')}
                >
                    Gradual Feedback
                </button>
            </main>
        </div>
    );
};

export default HomePage;

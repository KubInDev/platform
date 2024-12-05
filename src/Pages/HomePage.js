import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [studentId, setStudentId] = useState('');

    const handleFeedbackSelection = (type) => {
        if (!studentId.trim()) {
            alert('Please enter your Student ID.');
            return;
        }

        // Save feedback type and student ID
        localStorage.setItem('feedbackType', type);
        localStorage.setItem('studentId', studentId);

        // Redirect to the PreTest page
        window.location.href = '/pre-test';
    };

    return (
        <div className="homepage">
            <header className="homepage-header">
                <h1>Feedback Test Program</h1>
                <p>Enter your Student ID and Choose Your Feedback Type</p>
            </header>
            <main className="homepage-main">
                <div className="input-container">
                    <label htmlFor="studentId">Student ID:</label>
                    <input
                        id="studentId"
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter your Student ID"
                    />
                </div>
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

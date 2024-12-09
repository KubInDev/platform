import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExaminerValidationPage = () => {
    const [testType, setTestType] = useState('');
    const [pendingAnswers, setPendingAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectionPage, setSelectionPage] = useState(true); // Tracks whether user is on the test type selection page

    // Fetch pending answers based on test type
    const fetchPendingAnswers = async (selectedTestType) => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/pending-answers', {
                params: { testType: selectedTestType },
            });
            console.log('Pending Answers:', response.data); // Debug log
            setPendingAnswers(response.data);
            setTestType(selectedTestType);
            setSelectionPage(false); // Move to validation page
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pending answers:', error);
            setLoading(false);
        }
    };
    

    // Handle answer validation
    const handleValidation = async (answerId, isValid, score, testType, questionId, answerType, feedbackType, answer) => {
        console.log('Submitting Validation:', {
            answerId,
            isValid,
            score,
            testType,
            questionId,
            answerType,
            feedbackType,
            answer,
        });
    
        try {
            await axios.post('http://localhost:5000/api/validate-answer', {
                answerId,
                isValid,
                score,
                testType,
                questionId,
                answerType,
                feedbackType,
                answer,
            });
    
            setPendingAnswers((prev) => prev.filter((ans) => ans.id !== answerId));
        } catch (error) {
            console.error('Error validating answer:', error);
        }
    };
    

    // Go back to test selection
    const handleBackToSelection = () => {
        setPendingAnswers([]);
        setSelectionPage(true);
    };

    return (
        <div>
            {selectionPage ? (
                <div>
                    <h1>Select Test Type</h1>
                    <button onClick={() => fetchPendingAnswers('pre-test')}>Pre-Test</button>
                    <button onClick={() => fetchPendingAnswers('main-test')} style={{ marginLeft: '10px' }}>
                        Main Test
                    </button>
                    <button onClick={() => fetchPendingAnswers('post-test')} style={{ marginLeft: '10px' }}>
                        Post-Test
                    </button>
                </div>
            ) : (
                <div>
                    <button onClick={handleBackToSelection} style={{ marginBottom: '20px' }}>
                        Go Back to Test Selection
                    </button>
                    <h1>{testType.replace('-', ' ').toUpperCase()} Validation</h1>
                    {loading ? (
                        <p>Loading answers...</p>
                    ) : (
                        pendingAnswers.map((answer) => (
                            <div
                                key={answer.id}
                                style={{ border: '1px solid black', margin: '10px', padding: '10px' }}
                            >
                                <p><strong>Question:</strong> {answer.question_text}</p>
                                <p><strong>Student Answer:</strong> {answer.answer}</p>
                                <p><strong>Correct Answer:</strong> {answer.correct_answer}</p>
                                <p><strong>Feedback Type:</strong> {answer.feedbackType}</p>
                                <p><strong>Answer Type:</strong> {answer.answerType}</p>
                                {answer.feedbackType === 'gradual' ? (
                                    <div>
                                        <label>
                                            <strong>Score:</strong>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                onChange={(e) => {
                                                    const value = parseFloat(e.target.value);
                                                    if (value >= 1 && value <= 100) {
                                                        answer.score = value; // Update the answer object with a valid score
                                                        console.log('Updated Score:', value); // Debug log
                                                    } else {
                                                        alert('Score must be between 1 and 100');
                                                    }
                                                }}
                                                style={{ marginLeft: '10px' }}
                                            />

                                        </label>
                                        <button
                                        style={{ marginLeft: '10px' }}
                                        onClick={() => {
                                            console.log('Submitting Validation:', {
                                                answerId: answer.id,
                                                isValid: true, // Gradual feedback is considered valid if score is provided
                                                score: answer.score, // Examiner-provided score
                                                testType,
                                                questionId: answer.question_id,
                                                answerType: answer.answerType,
                                                feedbackType: answer.feedbackType,
                                                answer: answer.answer, // Original user-provided answer
                                            });
                                            handleValidation(
                                                answer.id, // answerId
                                                true, // isValid
                                                answer.score, // Score provided by examiner
                                                testType,
                                                answer.question_id,
                                                answer.answerType,
                                                answer.feedbackType,
                                                answer.answer
                                            );
                                        }}
                                    >
                                Submit Score
                                    </button>

                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            onClick={() =>
                                                handleValidation(
                                                    answer.id,
                                                    true, // isValid
                                                    null, // no score for binary feedback
                                                    testType,
                                                    answer.question_id,
                                                    answer.answerType,
                                                    answer.feedbackType,
                                                    answer.answer
                                                )
                                            }
                                            style={{ marginRight: '10px' }}
                                        >
                                            Mark as Correct
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleValidation(
                                                    answer.id,
                                                    false, // isValid
                                                    null, // no score for binary feedback
                                                    testType,
                                                    answer.question_id,
                                                    answer.answerType,
                                                    answer.feedbackType,
                                                    answer.answer
                                                )
                                            }
                                        >
                                            Mark as Incorrect
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ExaminerValidationPage;

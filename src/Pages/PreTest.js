import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PreTest = () => {
    const [questions, setQuestions] = useState([]); // Store questions
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
    const [loading, setLoading] = useState(true); // Loading state
    const [answers, setAnswers] = useState([]); // Store answers

    useEffect(() => {
        // Fetch 3 easy questions from the backend
        axios
            .get('http://localhost:5000/api/questions', {
                params: { difficulty: 'easy', limit: 3 }, // Assuming backend supports limiting results
            })
            .then((response) => {
                setQuestions(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching questions:', error);
                setLoading(false);
            });
    }, []);

    const handleSubmitAnswer = (isCorrect) => {
        const question = questions[currentQuestionIndex];
        const answerData = {
            questionId: question.id,
            isCorrect,
            timeTaken: Math.random() * 10, // Placeholder for time taken
        };

        setAnswers([...answers, answerData]); // Save answer

        if (currentQuestionIndex < questions.length - 1) {
            // Go to next question if not done
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Submit results when done with 3 questions
            axios
                .post('http://localhost:5000/api/pre-test-results', { results: [...answers, answerData] })
                .then(() => {
                    console.log('Pre-test results saved.');
                    window.location.href = '/main-test'; // Redirect to main test
                })
                .catch((error) => {
                    console.error('Error saving results:', error);
                });
        }
    };

    // Show a loading spinner if data is still being fetched
    if (loading) return <div>Loading questions...</div>;

    // If questions are not loaded or empty, display an error message
    if (!questions || questions.length === 0) return <div>No questions available.</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div>
            <h1>Pre-Test</h1>
            <p>Answer the following question:</p>
            <p><strong>{currentQuestion.question_text}</strong></p>
            <button onClick={() => handleSubmitAnswer(true)}>Correct</button>
            <button onClick={() => handleSubmitAnswer(false)}>Incorrect</button>
        </div>
    );
};

export default PreTest;

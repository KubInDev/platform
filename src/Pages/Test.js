import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [attempts, setAttempts] = useState(0);
    const maxAttempts = 3;

    useEffect(() => {
        axios.get('/api/questions').then((response) => {
            setQuestions(response.data);
        });
    }, []);

    const handleSubmit = () => {
        const question = questions[currentQuestionIndex];
        const isCorrect = answer === question.correctAnswer;

        axios.post('/api/questions/submit', {
            participantId: 1, // Placeholder
            questionIndex: currentQuestionIndex,
            answer,
            correct: isCorrect,
        });

        if (isCorrect) {
            setFeedback('Correct!');
            setCurrentQuestionIndex((prev) => prev + 1);
            setAttempts(0);
        } else {
            setFeedback(`Incorrect! You have ${maxAttempts - (attempts + 1)} attempts left.`);
            setAttempts((prev) => prev + 1);
        }

        if (attempts + 1 >= maxAttempts) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setAttempts(0);
        }

        setAnswer('');
    };

    if (questions.length === 0) return <p>Loading...</p>;

    if (currentQuestionIndex >= questions.length) return <p>Test Complete!</p>;

    return (
        <div>
            <h1>Test</h1>
            <p>{questions[currentQuestionIndex].question}</p>
            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
            />
            <button onClick={handleSubmit}>Submit</button>
            {feedback && <p>{feedback}</p>}
        </div>
    );
};

export default TestPage;

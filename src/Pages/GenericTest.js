import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GenericTest = ({ testType, questionConfig, nextPage }) => {
    const [studentId, setStudentId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState('');
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        // Retrieve student ID from localStorage
        const id = localStorage.getItem('studentId');
        setStudentId(id);

        // Fetch questions based on questionConfig
        const fetchQuestions = async () => {
            try {
                const allQuestions = [];
                for (const { difficulty, limit } of questionConfig) {
                    const response = await axios.get('http://localhost:5000/api/questions', {
                        params: { difficulty, limit },
                    });
                    allQuestions.push(...response.data);
                }
                setQuestions(allQuestions);
                setLoading(false);
                setStartTime(Date.now()); // Start timing the first question
            } catch (error) {
                console.error('Error fetching questions:', error);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [questionConfig]);

    const handleSubmitAnswer = (answerType) => {
        const question = questions[currentQuestionIndex];
        const timeTaken = (Date.now() - startTime) / 1000;
        const payload = {
            testType,
            studentId,
            questionId: question.id,
            answer,
            time: parseInt(timeTaken),
            isCorrect: answerType === 'linear' ? question.correct_answer === answer.trim() : null,
            answerType,
        };

        axios
            .post('http://localhost:5000/api/test-results', payload)
            .then(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setStartTime(Date.now());
                    setAnswer('');
                } else {
                    window.location.href = nextPage; // Redirect to the next page
                }
            })
            .catch((error) => {
                console.error('Error submitting answer:', error);
            });
    };

    if (loading) return <div>Loading questions...</div>;
    if (!questions || questions.length === 0) return <div>No questions available.</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div>
            <h1>{testType} Test</h1>
            <p>Student ID: {studentId}</p>
            <p>{currentQuestion.question_text}</p>
            <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                rows="4"
                cols="50"
            ></textarea>
            <div>
                <button onClick={() => handleSubmitAnswer('linear')}>Submit Equation</button>
                <button onClick={() => handleSubmitAnswer('description')}>Submit Description</button>
            </div>
        </div>
    );
};

export default GenericTest;

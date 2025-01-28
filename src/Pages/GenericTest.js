import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GenericTest = ({ testType, questionConfig, nextPage }) => {
    const [studentId, setStudentId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState('');
    const [startTime, setStartTime] = useState(null);
    const feedbackType = localStorage.getItem('feedbackType'); // 'binary' or 'gradual'

    useEffect(() => {
        const id = localStorage.getItem('studentId');
        setStudentId(id);

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
                setStartTime(Date.now());
            } catch (error) {
                console.error('Error fetching questions:', error);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [questionConfig]);


    const handleSubmitAnswer = async (answerType) => {
        const question = questions[currentQuestionIndex];
        const timeTaken = (Date.now() - startTime) / 1000;
    
        const payload = {
            testType,
            studentId,
            questionId: question.id,
            answer,
            time: parseInt(timeTaken),
            answerType,
            feedbackType, // Include feedbackType
        };
    
        try {
            const response = await axios.post('http://localhost:5000/api/test-results', payload);
    
            // Handle response for different answer types
            if (answerType === 'linear') {
                const validationResult = response.data.validationResult;
    
                if (validationResult?.isValid) {
                    alert(validationResult.message); // Notify user of correct answer
                } else {
                    alert(validationResult?.message || 'Incorrect answer. Please try again.');
                    return; // Stop progression for incorrect answers
                }
            } else if (answerType === 'description') {
                alert('Your answer has been submitted for examiner review.');
            }
    
            // Move to the next question
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setStartTime(Date.now());
                setAnswer('');
            } else {
                window.location.href = nextPage; // Navigate to the next page after all questions
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };
    


    if (loading) return <div>Loading...</div>;
    if (!questions.length) return <div>No questions available.</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div>
            <h1>{testType} Test</h1>
            <p>{currentQuestion.question_text}</p>
            <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                rows="4"
                cols="50"
            />
            <div>
                <button onClick={() => handleSubmitAnswer('linear')}>Submit Equation</button>
                <button onClick={() => handleSubmitAnswer('description')}>Submit Description</button>
            </div>
        </div>
    );
};

export default GenericTest;

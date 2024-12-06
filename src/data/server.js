// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getQuestionsByDifficulty, getRandomQuestionsByDifficulty } = require('./questions');
const { savePreTestResult } = require ('./results');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// API to fetch questions by difficulty
app.get('/api/questions', async (req, res) => {
    try {
        const { difficulty } = req.query;
        const questions = await getQuestionsByDifficulty(difficulty);
        console.log(questions);
        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// API to add a new question NOT USED
/*app.post('/api/questions', async (req, res) => {
    try {
        const { questionText, difficulty, correctAnswer } = req.body;
        const newQuestionId = await addQuestion(questionText, difficulty, correctAnswer);
        res.status(201).json({ id: newQuestionId, message: 'Question added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});*/

app.post('/api/pre-test-results', async (req, res) => {

    try {
        const { studentId, questionId, answer, time, isCorrect, answerType } = req.body;
        const resultSubmit = await savePreTestResult(studentId, questionId, answer, time, isCorrect, answerType);
        res.status(201).json({ id: resultSubmit, message: 'Answer submitted successfully' });
    } catch (err) {
        console.error('Error saving pre-test result:', err);
        res.status(500).json({ error: 'Database error' });
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

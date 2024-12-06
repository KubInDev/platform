// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getQuestionsByDifficulty, getRandomQuestionsByDifficulty } = require('./questions');
const { saveTestResult } = require ('./results');

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

app.post('/api/test-results', async (req, res) => {
    try {
        const { testType, studentId, questionId, answer, time, isCorrect, answerType } = req.body;
        // Determine the table name based on the test type TODO: ADD TO ENV
        let tableName;
        if (testType === 'pre-test') {
            tableName = 'pretest_results';
        } else if (testType === 'main-test') {
            tableName = 'test_results';
        } else if (testType === 'post-test') {
            tableName = 'posttest_results';
        } else {
            return res.status(400).json({ error: 'Invalid test type' });
        }
        // Save the result to the appropriate table
        const resultSubmit = await saveTestResult(
            tableName,
            studentId,
            questionId,
            answer,
            time,
            isCorrect,
            answerType
        );
        console.log( resultSubmit);
        res.status(201).json({ id: resultSubmit, message: 'Answer submitted successfully' });
    } catch (err) {
        console.error('Error saving test result:', err);
        res.status(500).json({ error: 'Database error' });
    }
});




const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

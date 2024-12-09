// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getQuestionsByDifficulty, getRandomQuestionsByDifficulty } = require('./questions');
const { saveTestResult, getPendingAnswers } = require ('./results');
const { validateAnswer } = require('./answer'); // Import the validation logic
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


// API to save test results and validate answers
app.post('/api/test-results', async (req, res) => {
    try {
        const {
            testType,
            studentId,
            questionId,
            answer,
            time,
            answerType,
            feedbackType,
        } = req.body;

        const tableName =
            testType === 'pre-test'
                ? 'pretest_results'
                : testType === 'main-test'
                ? 'test_results'
                : 'posttest_results';

        // Save the test result and get the ID of the inserted row
        const resultId = await saveTestResult(
            tableName,
            studentId,
            questionId,
            answer,
            time,
            null, // isCorrect
            answerType,
            feedbackType
        );

        console.log('Result ID:', resultId); // Debug log for resultId

        // Perform validation if the answer type is 'linear'
        let validationResult = null;
        if (answerType === 'linear') {
            validationResult = await validateAnswer(
                feedbackType,
                testType,
                questionId,
                answer,
                answerType,
                resultId // Pass the correct resultId here
            );
        }

        res.status(200).json({
            message: 'Answer processed successfully',
            validationResult,
            id: resultId,
        });
    } catch (err) {
        console.error('Error saving test result:', err);
        res.status(500).json({ error: 'Failed to save test result' });
    }
});





// API to fetch pending answers for validation
// API to fetch pending answers for validation
app.get('/api/pending-answers', async (req, res) => {
    try {
        const { testType } = req.query;

        if (!testType) {
            return res.status(400).json({ error: 'Test type is required' });
        }

        // Determine the table name based on the test type
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

        // Call the helper function with the appropriate table name
        const pendingAnswers = await getPendingAnswers(tableName);

        res.status(200).json(pendingAnswers);
    } catch (err) {
        console.error('Error fetching pending answers:', err);
        res.status(500).json({ error: 'Failed to fetch pending answers' });
    }
});


app.post('/api/validate-answer', async (req, res) => {
    try {
        const { answerId, testType, questionId, answer, answerType, feedbackType, isValid, score } = req.body;

        console.log('Received Validation Data:', { answerId, testType, questionId, answer, answerType, feedbackType, isValid, score }); // Debug log

        if (!answerId || !testType || !questionId || !answerType || !feedbackType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Perform validation and update database
        const validationResult = await validateAnswer(
            feedbackType,
            testType,
            questionId,
            score || (isValid ? 'true' : 'false'), // Pass score or binary true/false
            answerType,
            answerId,
            isValid,
            score
        );

        res.status(200).json({
            message: 'Answer validated successfully',
            validationResult,
        });
    } catch (err) {
        console.error('Error validating answer:', err);
        res.status(500).json({ error: 'Failed to validate answer' });
    }
});






const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

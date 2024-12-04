// questions.js
const db = require('./db'); // Import the database connection

// Function to fetch questions by difficulty
const getQuestionsByDifficulty = async (difficulty) => {
    const [rows] = await db.query('SELECT * FROM questions WHERE difficulty = ?', [difficulty]);
    return rows;
};

// Function to add a new question
const addQuestion = async (questionText, difficulty, correctAnswer) => {
    const result = await db.query(
        'INSERT INTO questions (question_text, difficulty, correct_answer) VALUES (?, ?, ?)',
        [questionText, difficulty, correctAnswer]
    );
    return result.insertId; // Return the ID of the newly inserted question
};

module.exports = {
    getQuestionsByDifficulty,
    addQuestion,
};
